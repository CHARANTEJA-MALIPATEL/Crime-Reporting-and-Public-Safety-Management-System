# Evidence Display Troubleshooting Guide

## Issue
Evidence buttons not showing in admin dashboard even after submitting reports with photos.

## Root Cause Analysis
The evidence display feature requires:
1. Database has `report_evidence` table (✓ exists in schema)
2. Backend saves evidence to database when report is submitted (✓ code implemented)
3. Backend query returns evidence data (✓ code implemented)
4. Frontend displays evidence buttons (✓ code implemented)
5. **NEW reports submitted AFTER code changes** (⚠️ likely issue)

## Quick Diagnosis Steps

### Step 1: Check Database Evidence
Run this command from the project root:
```bash
cd server
node check_evidence.js
```

This will show:
- Recent reports in database
- Evidence files in report_evidence table
- Joined data (what admin dashboard receives)

### Step 2: Check Browser Console
1. Open admin dashboard in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these debug messages:
   - "Reports loaded: X"
   - "Sample report data: {...}"
   - "Report CR-XXXX-XXXX has evidence: filename.jpg"

### Step 3: Verify Backend is Running Latest Code
1. Stop the backend server (Ctrl+C)
2. Restart it:
   ```bash
   cd server
   node server.js
   ```
3. Make sure you see: "Server is running on port 3000"

### Step 4: Submit a NEW Test Report
**IMPORTANT**: Old reports submitted before the code changes won't have evidence in the database!

1. Login as a regular user (not admin)
2. Go to Report page
3. Fill out the form completely:
   - Title: "Test Evidence Upload"
   - Description: "Testing photo evidence feature"
   - Location: "Test Location"
   - Contact Phone: "1234567890"
   - **Upload a photo** (JPEG or PNG)
4. Submit the report
5. Login as admin
6. Check if the new report shows evidence button

## Expected Behavior

When evidence exists, you should see a green box like this:
```
┌─────────────────────────────────────────┐
│ 📎 Evidence Attached:                   │
│                                         │
│ [🖼️ View Evidence 1 🔗]                │
└─────────────────────────────────────────┘
```

## Common Issues & Solutions

### Issue 1: Old Reports Don't Show Evidence
**Cause**: Reports submitted before code changes don't have evidence in database
**Solution**: Submit a NEW report with photo after code changes

### Issue 2: Backend Not Restarted
**Cause**: Backend still running old code without evidence saving
**Solution**: Restart backend server

### Issue 3: contact_phone Column Missing
**Cause**: Database migration not run
**Solution**: Run this SQL:
```sql
USE crime_reporting_db;
ALTER TABLE crime_reports ADD COLUMN contact_phone VARCHAR(20) AFTER location;
```

### Issue 4: Uploads Folder Missing
**Cause**: Server can't save uploaded files
**Solution**: The server creates it automatically, but verify it exists:
```bash
ls server/uploads
```

## Files Modified for Evidence Feature

1. `server/routes/reports.js` (lines 70-85, 105-115)
   - Saves evidence to database
   - Returns evidence in query

2. `client/js/admin.js` (lines 250-273)
   - Displays evidence buttons
   - Added debug logging

3. `client/js/report.js`
   - Handles file upload in report form

## Debug Output Added

The admin dashboard now logs:
- Total reports loaded
- Sample report structure
- Which reports have evidence files

Check browser console (F12) to see this information.

## Next Steps

1. Run `node server/check_evidence.js` to see database state
2. Check browser console for debug messages
3. Submit a NEW test report with photo
4. If still not working, share the output from Step 1 and Step 2
