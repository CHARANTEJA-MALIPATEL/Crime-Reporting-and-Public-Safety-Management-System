const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

async function forceInit() {
    console.log('--- Force Database Initialization ---');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);

    try {
        // 1. Connect without database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            multipleStatements: true
        });

        console.log('1. Connected to MySQL.');

        // 2. Create database
        console.log(`2. Re-creating database ${process.env.DB_NAME}...`);
        await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
        await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);

        // 3. Switch to database
        console.log(`3. Using database ${process.env.DB_NAME}...`);
        await connection.query(`USE ${process.env.DB_NAME}`);

        // 4. Read and execute schema
        const schemaPath = path.resolve(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('4. Executing schema.sql...');
        await connection.query(schemaSql);

        // 5. Verify tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('5. Tables created:', tables.map(t => Object.values(t)[0]).join(', '));

        // 6. Final DB check
        const [dbs] = await connection.query('SHOW DATABASES');
        console.log('6. All Databases:', dbs.map(d => Object.values(d)[0]).join(', '));

        await connection.end();
        console.log('--- Initialization Finished Successfully ---');
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

forceInit();
