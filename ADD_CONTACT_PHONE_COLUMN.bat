@echo off
echo ========================================
echo Adding contact_phone Column to Database
echo ========================================
echo.

cd database
node -e "const db = require('../server/db'); async function addColumn() { try { await db.query('ALTER TABLE crime_reports ADD COLUMN contact_phone VARCHAR(20) AFTER location'); console.log('✅ Column added successfully!'); } catch(err) { if(err.code === 'ER_DUP_FIELDNAME') { console.log('✅ Column already exists!'); } else { console.error('❌ Error:', err.message); } } process.exit(0); } addColumn();"

echo.
echo ========================================
echo Done!
echo ========================================
pause
