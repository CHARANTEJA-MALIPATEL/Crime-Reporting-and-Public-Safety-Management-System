# Complete Evidence Feature Test

## What I've Done

### 1. Added Debug Logging to Admin Dashboard
The admin.js now logs:
- Total number of reports loaded
- Sample report structure (first report)
- Which reports have evidence files

### 2. Improved Evidence Display Logic
- Better null checking for evidence_files
- Trim whitespace from filenames
- More robust conditional rendering

### 3. Created Database Check Script
Run `node server/check_evidence.js` to see:
- Recent reports in database
- Evidence files in report_evidence table
- Joined data (what admin sees)

## Testing Instructions

### Step 1: Verify Backend is Running
```bash
cd server
node server.js
```
You should see: "Server is running on port 3000"

### Step 2: Check Database State
```bash
cd server
node check_evidence.js
```

Look for:
- Do you see any entries in "Recent evidence"?
- Do any reports in "Joined data" have evidence_files?

### Step 3: Submit a NEW Test Report

**CRITICAL**: You MUST submit a NEW report AFTER the code changes!

1. Open browser to http://localhost:3000
2. Login as a regular user (NOT admin)
3. Click "Report Crime"
4. Fill out the form:
   - Title: "Test Evidence Feature"
   - Contact Phone: "9876543210"
   - Location: "Test Location"
   - Description: "This is a test report to verify evidence upload works"
   - **Upload a photo** (click "Choose File" and select a JPG or PNG)
5. Click "Submit Report"
6. You should see success message with complaint ID

### Step 4: Check Admin Dashboard

1. Logout
2. Login as admin
   - Email: admin@safecity.com
   - Password: admin123
3. Go to admin dashboard
4. Press F12 to open Developer Console
5. Look for these messages:
   ```
   Reports loaded: X
   Sample report data: {...}
   Report CR-2026-XXXX has evidence: filename.jpg
   ```

6. Scroll through reports and find your test report
7. You should see a GREEN box with "Evidence Attached" and a "View Evidence" button

### Step 5: Click Evidence Button

1. Click the "View Evidence 1" button
2. It should open the image in a new tab
3. URL should be: http://localhost:3000/uploads/[timestamp].jpg

## Expected Results

✅ Database check shows evidence in report_evidence table
✅ Console shows "Report CR-XXXX-XXXX has evidence: filename.jpg"
✅ Admin dashboard shows green evidence box
✅ Clicking button opens image in new tab

## If Evidence Still Not Showing

### Check 1: Is the report NEW?
Old reports (submitted before code changes) won't have evidence in database.
Solution: Submit a NEW report with photo.

### Check 2: Did you upload a file?
Make sure you clicked "Choose File" and selected an image before submitting.
Solution: Submit another report and verify file is selected.

### Check 3: Is backend running latest code?
Backend must be restarted after code changes.
Solution: Stop backend (Ctrl+C) and restart (node server.js).

### Check 4: Check browser console
Press F12 and look for:
- JavaScript errors (red text)
- Debug messages about evidence
- Network errors (check Network tab)

### Check 5: Check database directly
Run the check_evidence.js script and verify:
- report_evidence table has entries
- file_path column has filenames
- Joined query returns evidence_files

## What the Code Does

### Backend (server/routes/reports.js)
1. Receives file upload via multer
2. Saves file to server/uploads/ folder
3. Inserts filename into report_evidence table
4. Links evidence to report via report_id

### Frontend (client/js/admin.js)
1. Fetches all reports with evidence data
2. Checks if report.evidence_files exists and is not empty
3. Renders green evidence box with buttons
4. Each button links to /uploads/[filename]

### Database Query
```sql
SELECT r.*, 
       GROUP_CONCAT(e.file_path) as evidence_files,
       GROUP_CONCAT(e.file_type) as evidence_types
FROM crime_reports r 
LEFT JOIN report_evidence e ON r.report_id = e.report_id
GROUP BY r.report_id
```

This combines multiple evidence files into comma-separated strings.

## Common Mistakes

❌ Testing with old reports (submitted before code changes)
✅ Submit NEW report after code changes

❌ Forgetting to upload a file when submitting report
✅ Click "Choose File" and select an image

❌ Backend not restarted after code changes
✅ Stop and restart backend server

❌ Looking at wrong report in admin dashboard
✅ Find the newest report (top of list)

## Files Modified

1. `client/js/admin.js` - Added debug logging and improved evidence display
2. `server/check_evidence.js` - NEW: Database verification script
3. `EVIDENCE_TROUBLESHOOTING.md` - NEW: Troubleshooting guide
4. `TEST_EVIDENCE_COMPLETE.md` - NEW: This testing guide

## Next Steps

1. Run the database check script
2. Check browser console for debug messages
3. Submit a NEW test report with photo
4. Share the console output if still not working
