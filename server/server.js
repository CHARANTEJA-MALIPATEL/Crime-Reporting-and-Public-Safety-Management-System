const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const otpRoutes = require('./routes/otpRoutes');
const mlRoutes = require('./routes/mlRoutes');
const usersRoutes = require('./routes/users');

// STRICT API REQUIREMENTS - Must come BEFORE static files
app.use('/api', otpRoutes); // Mount /api/send-otp and /api/verify-otp
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ml', mlRoutes);  // ML service proxy: /api/ml/status, /api/ml/predict
app.use('/api/users', usersRoutes); // User profile routes

// Static folder for uploaded evidence - Must come BEFORE catch-all
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test endpoint to verify uploads folder
app.get('/test-uploads', (req, res) => {
    const fs = require('fs');
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    res.json({ 
        message: 'Uploads folder is accessible',
        files: files,
        sampleUrl: files.length > 0 ? `/uploads/${files[0]}` : 'No files yet'
    });
});

// Static folder for frontend
app.use(express.static(path.join(__dirname, '../client')));

// Catch-all to serve index.html for frontend routing - Must be LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Create uploads directory if not exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
