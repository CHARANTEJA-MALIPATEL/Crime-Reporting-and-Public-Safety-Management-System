const mysql = require('../server/node_modules/mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crime_reporting_db'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection error:', err.message);
        process.exit(1);
    }
    
    console.log('✅ Connected to database');
    console.log('Adding contact_phone column...');
    
    connection.query('ALTER TABLE crime_reports ADD COLUMN contact_phone VARCHAR(20) AFTER location', (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('✅ Column already exists!');
            } else {
                console.error('❌ Error:', error.message);
            }
        } else {
            console.log('✅ Column added successfully!');
        }
        
        connection.end();
        process.exit(0);
    });
});
