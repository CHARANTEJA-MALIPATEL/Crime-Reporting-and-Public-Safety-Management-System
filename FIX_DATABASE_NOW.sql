-- Run this SQL in your MySQL client (phpMyAdmin, MySQL Workbench, or command line)

USE crime_reporting_db;

-- Add contact_phone column if it doesn't exist
ALTER TABLE crime_reports 
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20) AFTER location;

-- Verify the column was added
DESCRIBE crime_reports;
