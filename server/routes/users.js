const express = require('express');
const router = express.Router();
const db = require('../db');

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

// GET /api/users/profile - Get current user's profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, name, email, phone, role, created_at FROM users WHERE user_id = ?',
            [req.authData.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];
        res.json({
            id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone || 'Not provided',
            role: user.role,
            created_at: user.created_at
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/profile - Update current user's profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        // Validate input
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check if email is already taken by another user
        const [existingUsers] = await db.query(
            'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
            [email, req.authData.id]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already in use by another account' });
        }

        // Update user profile
        await db.query(
            'UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?',
            [name, email, phone || null, req.authData.id]
        );

        res.json({ 
            message: 'Profile updated successfully',
            user: { name, email, phone: phone || 'Not provided' }
        });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
