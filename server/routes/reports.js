const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const db = require('../db');

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('evidence');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const jwt = require('jsonwebtoken');
        jwt.verify(bearerToken, process.env.JWT_SECRET || 'secret', (err, authData) => {
            if (err) return res.sendStatus(403);
            req.authData = authData;
            next();
        });
    } else {
        res.sendStatus(403);
    }
};

// Helper: Generate Complaint ID (CR-YYYY-XXXX)
const generateComplaintId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `CR-${year}-${random}`;
};

// 1. POST /api/reports/submit - Submit new crime report
router.post('/submit', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const { title, description, location, contactPhone } = req.body;
        const userId = req.authData.id;
        let mlPredictedType = 'Unclassified';
        let aiModel = 'AI Classification';

        try {
            const mlResponse = await axios.post('http://localhost:5000/predict', { description });
            if (mlResponse.data && mlResponse.data.category) {
                mlPredictedType = mlResponse.data.category;
                // Check if response includes AI model info
                if (mlResponse.data.ai_model) {
                    aiModel = mlResponse.data.ai_model;
                } else {
                    aiModel = 'Traditional ML';
                }
            }
        } catch (mlError) {
            console.error('ML Service Error:', mlError.message);
            aiModel = 'Classification Service Unavailable';
        }

        try {
            const complaintId = generateComplaintId();
            
            // Insert the report
            const [result] = await db.query(
                'INSERT INTO crime_reports (complaint_id, user_id, title, description, location, contact_phone, ml_predicted_type, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [complaintId, userId, title, description, location, contactPhone, mlPredictedType, 0]
            );
            
            const reportId = result.insertId;
            
            // If evidence file was uploaded, save it to report_evidence table
            if (req.file) {
                const filePath = req.file.filename;
                const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 
                                req.file.mimetype.startsWith('video/') ? 'video' : 'document';
                
                await db.query(
                    'INSERT INTO report_evidence (report_id, file_path, file_type) VALUES (?, ?, ?)',
                    [reportId, filePath, fileType]
                );
            }

            res.status(201).json({
                message: 'Complaint submitted successfully',
                complaintId,
                predictedCrimeType: mlPredictedType,
                aiModel: aiModel
            });
        } catch (dbError) {
            res.status(500).json({ error: dbError.message });
        }
    });
});

// 2. GET /api/reports/my-reports - View self reports
router.get('/my-reports', verifyToken, async (req, res) => {
    try {
        const [reports] = await db.query(
            'SELECT report_id, complaint_id, title, description, location, status, ml_predicted_type as crime_type, created_at FROM crime_reports WHERE user_id = ? ORDER BY created_at DESC',
            [req.authData.id]
        );
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET /api/reports/all - View all complaints (Admin/Police)
router.get('/all', verifyToken, async (req, res) => {
    if (req.authData.role === 'citizen') return res.status(403).json({ error: 'Access denied' });

    try {
        const [reports] = await db.query(`
            SELECT r.report_id, r.complaint_id, r.title, r.description, r.location, r.contact_phone, r.status, r.ml_predicted_type as crime_type, r.is_anonymous, r.created_at, 
                   u.name as reported_by, u.email as user_email, u.phone as user_phone,
                   GROUP_CONCAT(e.file_path) as evidence_files,
                   GROUP_CONCAT(e.file_type) as evidence_types
            FROM crime_reports r 
            LEFT JOIN users u ON r.user_id = u.user_id 
            LEFT JOIN report_evidence e ON r.report_id = e.report_id
            GROUP BY r.report_id
            ORDER BY r.created_at DESC
        `);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. POST /api/reports/update-status - Update status & remarks
router.post('/update-status', verifyToken, async (req, res) => {
    if (req.authData.role === 'citizen') return res.status(403).json({ error: 'Access denied' });
    const { reportId, status, remark } = req.body;

    try {
        await db.query('UPDATE crime_reports SET status = ? WHERE report_id = ?', [status, reportId]);

        if (remark) {
            await db.query(
                'INSERT INTO report_tracking (report_id, status, remarks, updated_by) VALUES (?, ?, ?, ?)',
                [reportId, status, remark, req.authData.id]
            );
        }

        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. GET /api/reports/:id - Get specific report + tracking history
router.get('/:id', verifyToken, async (req, res) => {
    try {
        // First get the report
        const [reports] = await db.query(
            'SELECT report_id, complaint_id, title, description, location, status, ml_predicted_type as crime_type, created_at FROM crime_reports WHERE complaint_id = ?',
            [req.params.id]
        );

        if (reports.length === 0) return res.status(404).json({ error: 'Report not found' });
        const report = reports[0];

        // Then get the tracking history
        const [tracking] = await db.query(
            'SELECT status, remarks, updated_at FROM report_tracking WHERE report_id = ? ORDER BY updated_at ASC',
            [report.report_id]
        );

        res.json({ report, tracking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
