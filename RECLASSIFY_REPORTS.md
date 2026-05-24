# 🔧 Reclassify Existing Reports with Gemini AI

## Problem
Reports are showing "Unclassified" because they were submitted when the Gemini AI service wasn't running.

## Solution
We need to:
1. Start the Gemini AI service
2. Reclassify all existing reports
3. Update the database

---

## Step 1: Start Gemini AI Service

### Option A - Quick Start (Windows):
```
Double-click: ml/start_gemini_service.bat
```

### Option B - Manual Start:
```bash
cd ml
python gemini_service.py
```

**Wait for this message:**
```
✅ Gemini API: Configured
🌐 Server: http://localhost:5000
```

**Keep this terminal window open!**

---

## Step 2: Verify Gemini Service is Running

Open a new terminal and test:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "gemini_configured": true,
  "service": "gemini_crime_classifier"
}
```

---

## Step 3: Reclassify Existing Reports

I'll create a script to do this automatically.

### Create Reclassification Script

Save this as `server/reclassify_reports.js`:

```javascript
const db = require('./db');
const axios = require('axios');

async function reclassifyAllReports() {
    console.log('🔄 Starting reclassification of all reports...\n');
    
    try {
        // Get all reports that are unclassified or have no classification
        const [reports] = await db.query(
            'SELECT report_id, description, ml_predicted_type FROM crime_reports WHERE ml_predicted_type IS NULL OR ml_predicted_type = "Unclassified" OR ml_predicted_type = ""'
        );
        
        console.log(`📊 Found ${reports.length} reports to reclassify\n`);
        
        if (reports.length === 0) {
            console.log('✅ All reports are already classified!');
            process.exit(0);
        }
        
        let successCount = 0;
        let failCount = 0;
        
        for (const report of reports) {
            try {
                console.log(`Processing Report #${report.report_id}...`);
                console.log(`Description: ${report.description.substring(0, 50)}...`);
                
                // Call Gemini API
                const response = await axios.post('http://localhost:5000/predict', {
                    description: report.description
                });
                
                const category = response.data.category || 'Unclassified';
                
                // Update database
                await db.query(
                    'UPDATE crime_reports SET ml_predicted_type = ? WHERE report_id = ?',
                    [category, report.report_id]
                );
                
                console.log(`✅ Classified as: ${category}\n`);
                successCount++;
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`❌ Failed to classify Report #${report.report_id}:`, error.message);
                failCount++;
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 Reclassification Complete!');
        console.log('='.repeat(50));
        console.log(`✅ Successfully classified: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📋 Total processed: ${reports.length}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the reclassification
reclassifyAllReports();
```

---

## Step 4: Run the Reclassification Script

### Make sure:
1. ✅ Gemini service is running (port 5000)
2. ✅ Node.js backend is running (port 3000)
3. ✅ MySQL database is running

### Run the script:
```bash
cd server
node reclassify_reports.js
```

### Expected Output:
```
🔄 Starting reclassification of all reports...

📊 Found 5 reports to reclassify

Processing Report #1...
Description: Someone stole my bike from the parking lot...
✅ Classified as: Theft

Processing Report #2...
Description: My house was broken into last night...
✅ Classified as: Burglary

Processing Report #3...
Description: Someone hacked my email account...
✅ Classified as: Cybercrime

==================================================
📊 Reclassification Complete!
==================================================
✅ Successfully classified: 3
❌ Failed: 0
📋 Total processed: 3
```

---

## Step 5: Verify in Admin Dashboard

1. Refresh admin dashboard (Ctrl + Shift + R)
2. All reports should now show proper classifications
3. Each report will have a colored badge with crime type

---

## Alternative: Reclassify via SQL + Manual

If you prefer to do it manually:

### 1. Get all unclassified reports:
```sql
USE crime_reporting_db;
SELECT report_id, title, description FROM crime_reports 
WHERE ml_predicted_type IS NULL OR ml_predicted_type = 'Unclassified';
```

### 2. For each report, classify manually:
```bash
# Test classification
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d "{\"description\": \"YOUR_DESCRIPTION_HERE\"}"
```

### 3. Update database:
```sql
UPDATE crime_reports 
SET ml_predicted_type = 'Theft' 
WHERE report_id = 1;
```

---

## Prevent Future Issues

### Always start Gemini service BEFORE submitting reports!

### Startup Order:
1. **First**: Start Gemini AI Service
   ```bash
   cd ml
   python gemini_service.py
   ```

2. **Second**: Start Node.js Backend
   ```bash
   cd server
   npm start
   ```

3. **Third**: Open browser and use application

---

## Quick Start Script (All Services)

Use the provided batch file:
```
Double-click: START_ALL_SERVICES.bat
```

This will start both services in the correct order!

---

## Troubleshooting

### Issue: "Connection refused" when reclassifying
**Solution**: Make sure Gemini service is running on port 5000

### Issue: "Module not found"
**Solution**: 
```bash
cd server
npm install axios
```

### Issue: Script hangs
**Solution**: 
- Check if Gemini service is responding
- Test: `curl http://localhost:5000/health`
- Restart Gemini service if needed

### Issue: "Database connection error"
**Solution**: Make sure MySQL is running

---

## Summary

1. ✅ Start Gemini AI service
2. ✅ Run reclassification script
3. ✅ Refresh admin dashboard
4. ✅ All reports now show proper classifications!

From now on, always start Gemini service BEFORE using the application!
