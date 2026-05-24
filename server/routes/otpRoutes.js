const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

/**
 * OTP Routes
 * Base Path: /api
 */

// 1. Email OTP Routes
router.post('/send-email-otp', otpController.sendEmailOTP);
router.post('/verify-email-otp', otpController.verifyEmailOTP);

module.exports = router;
