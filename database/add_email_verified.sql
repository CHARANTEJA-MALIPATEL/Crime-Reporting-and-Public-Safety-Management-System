-- Add email_verified column if it doesn't exist
USE crime_reporting_db;

-- Add email_verified column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE AFTER phone_verified;

-- Create email_otp_verification table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_otp_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
);

-- Show tables to verify
SHOW TABLES;

-- Show users table structure
DESCRIBE users;
