// Quick script to check evidence data in database
const db = require('./db');

async function checkEvidence() {
    try {
        console.log('Checking crime_reports table...');
        const [reports] = await db.query('SELECT report_id, complaint_id, title, contact_phone FROM crime_reports ORDER BY created_at DESC LIMIT 5');
        console.log('Recent reports:', reports);
        
        console.log('\nChecking report_evidence table...');
        const [evidence] = await db.query('SELECT * FROM report_evidence ORDER BY uploaded_at DESC LIMIT 10');
        console.log('Recent evidence:', evidence);
        
        console.log('\nChecking joined data (what admin sees)...');
        const [joined] = await db.query(`
            SELECT r.report_id, r.complaint_id, r.title,
                   GROUP_CONCAT(e.file_path) as evidence_files,
                   GROUP_CONCAT(e.file_type) as evidence_types
            FROM crime_reports r 
            LEFT JOIN report_evidence e ON r.report_id = e.report_id
            GROUP BY r.report_id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);
        console.log('Joined data:', joined);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkEvidence();
