@echo off
echo ========================================
echo Adding contact_phone Column
echo ========================================
echo.

echo Please run this SQL command in phpMyAdmin:
echo.
echo USE crime_reporting_db;
echo ALTER TABLE crime_reports ADD COLUMN contact_phone VARCHAR(20) AFTER location;
echo.
echo ========================================
echo Steps:
echo 1. Open http://localhost/phpmyadmin
echo 2. Login (username: root, password: root)
echo 3. Click "crime_reporting_db" on the left
echo 4. Click "SQL" tab at the top
echo 5. Paste the command above
echo 6. Click "Go"
echo ========================================
pause

echo.
echo Trying to add column automatically...
echo.

cd server
node -p "const mysql = require('mysql2'); const conn = mysql.createConnection({host:'localhost',user:'root',password:'root',database:'crime_reporting_db'}); conn.connect(); conn.query('ALTER TABLE crime_reports ADD COLUMN contact_phone VARCHAR(20) AFTER location', (err) => { if(err && err.code !== 'ER_DUP_FIELDNAME') { console.log('Error:', err.message); console.log('Please add the column manually using phpMyAdmin'); } else { console.log('Success! Column added.'); } conn.end(); process.exit(0); });"

pause
