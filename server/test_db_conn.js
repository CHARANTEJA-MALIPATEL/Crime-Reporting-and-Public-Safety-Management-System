const pool = require('./db');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('--- Database Connection Test ---');

    // Test 1: Using current .env credentials
    try {
        console.log(`Test 1: Connecting as ${process.env.DB_USER} with password from .env...`);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('✅ Success: Connected with .env credentials.');
        await connection.end();
    } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
    }

    // Test 2: Connecting as root with NO password
    try {
        console.log('Test 2: Connecting as root with NO password...');
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: process.env.DB_NAME
        });
        console.log('✅ Success: Connected as root with NO password.');
        await connection.end();
    } catch (err) {
        console.log(`❌ Failed: ${err.message}`);
    }

    console.log('--- End of Test ---');
    process.exit(0);
}

testConnection();
