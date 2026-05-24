const db = require('../db');
const { sendOTPEmail } = require('../utils/emailService');
const bcrypt = require('bcrypt');

console.log("--- [DEBUG] otpController.js Loaded (Email-Only Mode) ---");

/**
 * Controller for OTP Verification Logic (Email Only)
 */
const otpController = {
    // 1. Send Email OTP
    sendEmailOTP: async (req, res) => {
        const { email } = req.body;
        console.log(`--- [DEBUG] sendEmailOTP called for: ${email} ---`);
        if (!email) return res.status(400).json({ error: 'Email is required' });

        try {
            const [lastOtpRows] = await db.query(
                'SELECT created_at FROM email_otp_verification WHERE email = ? ORDER BY created_at DESC LIMIT 1',
                [email]
            );

            if (lastOtpRows.length > 0) {
                const lastCreatedAt = new Date(lastOtpRows[0].created_at);
                const diffSeconds = (Date.now() - lastCreatedAt.getTime()) / 1000;

                if (diffSeconds < 60) {
                    return res.status(429).json({
                        error: `Please wait ${Math.ceil(60 - diffSeconds)} seconds before requesting a new email code.`
                    });
                }
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await db.query(
                'INSERT INTO email_otp_verification (email, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE)) ON DUPLICATE KEY UPDATE otp_code = ?, expires_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE), attempts = 0, created_at = CURRENT_TIMESTAMP',
                [email, otp, otp]
            );

            try {
                await sendOTPEmail(email, otp);
                res.json({ message: 'Verification code sent to your email.' });
            } catch (emailErr) {
                console.error('Email Sending Failed, Falling back to console log:', emailErr.message);
                console.log(`--- [DEMO FALLBACK] Email OTP for ${email}: ${otp} ---`);
                res.json({ message: 'Demo Mode: Email code logged to server console.' });
            }
        } catch (error) {
            console.error('Send Email OTP Error:', error);
            res.status(500).json({ error: 'Internal server error while sending email OTP.' });
        }
    },

    // 2. Verify Email OTP and Create User
    verifyEmailOTP: async (req, res) => {
        const { name, email, password, phone, role, otp } = req.body;
        console.log(`--- [DEBUG] verifyEmailOTP called for: ${email} with code: ${otp} ---`);

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        try {
            const [rows] = await db.query(
                'SELECT *, (expires_at < NOW()) as is_expired FROM email_otp_verification WHERE email = ?',
                [email]
            );

            if (rows.length === 0) return res.status(400).json({ error: 'No OTP found for this email' });

            const otpEntry = rows[0];
            if (otpEntry.attempts >= 3) return res.status(400).json({ error: 'Too many attempts. Please request a new code.' });
            if (otpEntry.is_expired) return res.status(400).json({ error: 'Code has expired' });

            if (otpEntry.otp_code !== otp) {
                await db.query('UPDATE email_otp_verification SET attempts = attempts + 1 WHERE id = ?', [otpEntry.id]);
                return res.status(400).json({ error: 'Invalid verification code.' });
            }

            // OTP is valid - Create User
            if (!name || !password) {
                return res.status(400).json({ error: 'Missing account details (name, password)' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const userRole = role === 'admin' ? 'admin' : (role === 'police' ? 'police' : 'citizen');
            
            // Ensure phone is stored as NULL if empty, not empty string
            const userPhone = phone && phone.trim() !== '' ? phone.trim() : null;

            const connection = await db.getConnection();
            await connection.beginTransaction();

            try {
                await connection.query(
                    'INSERT INTO users (name, email, password_hash, phone, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
                    [name, email, hashedPassword, userPhone, userRole, true]
                );
                await connection.query('DELETE FROM email_otp_verification WHERE email = ?', [email]);
                await connection.commit();
                res.status(201).json({ message: 'Registration successful! Email verified.' });
            } catch (err) {
                await connection.rollback();
                throw err;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Verify Email OTP Error:', error);
            res.status(500).json({ error: error.message || 'Email verification failed.' });
        }
    }
};

module.exports = otpController;
