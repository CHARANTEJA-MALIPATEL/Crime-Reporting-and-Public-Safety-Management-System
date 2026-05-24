-- Add contact_phone column to crime_reports table
ALTER TABLE crime_reports 
ADD COLUMN contact_phone VARCHAR(20) AFTER location;
