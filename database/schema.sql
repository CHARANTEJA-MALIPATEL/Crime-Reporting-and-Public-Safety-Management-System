-- Create the database
CREATE DATABASE IF NOT EXISTS crime_reporting_db;
USE crime_reporting_db;

-- 1. Users table (Matches strict requirements)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'admin', 'police') DEFAULT 'citizen',
    phone_verified BOOLEAN DEFAULT FALSE, -- [NEW] Track OTP verification status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [NEW] Table for storing temporary OTP verification codes
CREATE TABLE IF NOT EXISTS otp_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crime Reports table
CREATE TABLE IF NOT EXISTS crime_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE, -- Format: CR-YYYY-XXXX
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    ml_predicted_type VARCHAR(50), -- ML prediction
    final_crime_type VARCHAR(50),  -- Confirmed by Police
    status ENUM('pending', 'verified', 'investigation', 'resolved', 'rejected') DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Evidence Media table (Support table, kept for functionality)
CREATE TABLE IF NOT EXISTS report_evidence (
    evidence_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT,
    file_path VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'video', 'document') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES crime_reports(report_id) ON DELETE CASCADE
);

-- 3. Report Tracking table (Replaces report_remarks)
CREATE TABLE IF NOT EXISTS report_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT,
    status VARCHAR(50),
    remarks TEXT,
    updated_by INT, -- Link to admin/police user
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES crime_reports(report_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
);
