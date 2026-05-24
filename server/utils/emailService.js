const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends an OTP email using Nodemailer
 * @param {string} email - Recipient email address
 * @param {string} otpCode - The 6-digit OTP code
 * @returns {Promise}
 */
const sendOTPEmail = async (email, otpCode) => {
    const mailOptions = {
        from: `"SafeCity" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'SafeCity Email Verification Code',
        text: `Your SafeCity verification code is: ${otpCode}. This OTP will expire in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #1e3a8a;">SafeCity Verification</h2>
                <p>Hello,</p>
                <p>Your verification code for the Crime Reporting and Public Safety Management System is:</p>
                <div style="font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 20px 0;">${otpCode}</div>
                <p>This OTP will expire in <strong>5 minutes</strong>.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">SafeCity Team - Working for a safer community.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} via Nodemailer. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error;
    }
};

module.exports = { sendOTPEmail };
