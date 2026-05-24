const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

/**
 * Auth Routes
 * Base Path: /api/auth
 */

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = users[0];


        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.user_id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.user_id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// For backward compatibility or informative error
router.post('/register', (req, res) => {
    res.status(400).json({ error: 'Registration is now handled via /api/verify-otp. Please use the signup form.' });
});

module.exports = router;
