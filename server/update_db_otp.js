const db = require('./db');

async function updateDatabase() {
    try {
        console.log('Starting refined database update for Twilio OTP verification...');

        // 1. Add phone_verified column to users table (if not already exists)
        try {
            await db.query('ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE');
            console.log('Added phone_verified column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME' || err.errno === 1060) {
                console.log('phone_verified column already exists.');
            } else {
                throw err;
            }
        }

        // 2. Re-create otp_verification table to match exact production requirements
        await db.query('DROP TABLE IF EXISTS otp_verification');
        const createOtpTableQuery = `
            CREATE TABLE otp_verification (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone_number VARCHAR(20) NOT NULL,
                otp_code VARCHAR(6) NOT NULL,
                expires_at DATETIME NOT NULL,
                attempts INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(createOtpTableQuery);
        console.log('Re-created otp_verification table with exact requirements.');

        console.log('Database update completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating database:', err);
        process.exit(1);
    }
}

updateDatabase();
