const db = require('./db');
const axios = require('axios');

async function reclassifyAllReports() {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 RECLASSIFYING ALL REPORTS WITH GEMINI AI');
    console.log('='.repeat(60) + '\n');
    
    try {
        // First, check if Gemini service is running
        console.log('1️⃣  Checking Gemini AI service...');
        try {
            const healthCheck = await axios.get('http://localhost:5000/health', { timeout: 3000 });
            if (healthCheck.data.status === 'healthy') {
                console.log('   ✅ Gemini AI service is running\n');
            } else {
                throw new Error('Service not healthy');
            }
        } catch (error) {
            console.error('   ❌ Gemini AI service is NOT running!');
            console.error('   💡 Please start it first:');
            console.error('      cd ml');
            console.error('      python gemini_service.py\n');
            process.exit(1);
        }
        
        // Get all reports that need reclassification
        console.log('2️⃣  Fetching reports from database...');
        const [reports] = await db.query(
            `SELECT report_id, title, description, ml_predicted_type 
             FROM crime_reports 
             WHERE ml_predicted_type IS NULL 
                OR ml_predicted_type = 'Unclassified' 
                OR ml_predicted_type = ''
             ORDER BY report_id ASC`
        );
        
        console.log(`   📊 Found ${reports.length} reports to reclassify\n`);
        
        if (reports.length === 0) {
            console.log('✅ All reports are already classified!');
            console.log('   Nothing to do. Exiting...\n');
            process.exit(0);
        }
        
        console.log('3️⃣  Starting classification process...\n');
        console.log('-'.repeat(60));
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < reports.length; i++) {
            const report = reports[i];
            const progress = `[${i + 1}/${reports.length}]`;
            
            try {
                console.log(`\n${progress} Report #${report.report_id}: ${report.title}`);
                console.log(`   Description: "${report.description.substring(0, 80)}${report.description.length > 80 ? '...' : ''}"`);
                console.log(`   Current: ${report.ml_predicted_type || 'NULL'}`);
                
                // Call Gemini API
                const response = await axios.post('http://localhost:5000/predict', {
                    description: report.description
                }, { timeout: 10000 });
                
                const category = response.data.category || 'Unclassified';
                const aiModel = response.data.ai_model || 'Gemini Pro';
                
                // Update database
                await db.query(
                    'UPDATE crime_reports SET ml_predicted_type = ? WHERE report_id = ?',
                    [category, report.report_id]
                );
                
                console.log(`   ✅ Classified as: ${category} (by ${aiModel})`);
                successCount++;
                
                // Small delay to avoid rate limiting (Gemini free tier: 60 req/min)
                if (i < reports.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                console.error(`   ❌ Failed: ${error.message}`);
                failCount++;
            }
        }
        
        console.log('\n' + '-'.repeat(60));
        console.log('\n' + '='.repeat(60));
        console.log('📊 RECLASSIFICATION COMPLETE!');
        console.log('='.repeat(60));
        console.log(`✅ Successfully classified: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📋 Total processed: ${reports.length}`);
        console.log(`📈 Success rate: ${((successCount / reports.length) * 100).toFixed(1)}%`);
        console.log('='.repeat(60) + '\n');
        
        if (successCount > 0) {
            console.log('💡 Next steps:');
            console.log('   1. Refresh your admin dashboard (Ctrl + Shift + R)');
            console.log('   2. All reports should now show proper classifications');
            console.log('   3. From now on, keep Gemini service running!\n');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Make sure MySQL is running');
        console.error('   2. Make sure Gemini service is running (port 5000)');
        console.error('   3. Check your database connection in server/.env\n');
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Process interrupted by user');
    process.exit(0);
});

// Run the reclassification
console.log('\n🚀 Starting reclassification script...');
reclassifyAllReports();
