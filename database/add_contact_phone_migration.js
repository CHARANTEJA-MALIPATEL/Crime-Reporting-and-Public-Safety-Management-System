// Migration script to add contact_phone column
const db = require('../server/db');

async function addContactPhoneColumn() {
    try {
        console.log('Adding contact_phone column to crime_reports table...');
        
        await db.query(`
            ALTER TABLE crime_reports 
            ADD COLUMN contact_phone VARCHAR(20) AFTER location
        `);
        
        console.log('✅ Successfully added contact_phone column!');
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('✅ Column already exists - no action needed!');
            process.exit(0);
        } else {
            console.error('❌ Error adding column:', err.message);
            process.exit(1);
        }
    }
}

addContactPhoneColumn();
