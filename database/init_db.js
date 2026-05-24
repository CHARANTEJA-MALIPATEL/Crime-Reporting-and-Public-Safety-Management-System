const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Use absolute path for .env
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

async function initDatabase() {
    try {
        console.log('Connecting to MySQL server with:', {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME || 'crime_reporting_db'
        });

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema
        console.log('Executing schema.sql...');
        await connection.query(schemaSql);

        console.log('Database initialized successfully!');
        await connection.end();
    } catch (err) {
        console.error('Error initializing database:', err.message);
        process.exit(1);
    }
}

initDatabase();
