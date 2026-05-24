# 🧪 Test Evidence Display - Quick Guide

## ✅ Changes Applied

1. ✅ Backend saves evidence to database
2. ✅ Backend returns evidence in admin query
3. ✅ Admin.js displays evidence buttons
4. ✅ Fixed URL to use `/uploads/` directly

---

## 🚀 Quick Test Steps

### Step 1: Restart Backend
```bash
# Stop backend (Ctrl+C)
cd server
npm start
```

### Step 2: Submit New Report with Photo
1. Open browser: `http://localhost:3000`
2. Login as regular user
3. Click "Report Crime"
4. Fill form:
   - Title: "Test Evidence"
   - Phone: "1234567890"
   - Location: "Test"
   - Description: "Testing photo"
   - **Upload a photo** (important!)
5. Click "Submit Report"

### Step 3: View as Admin
1. Logout
2. Login as admin
3. Go to admin dashboard
4. Find your "Test Evidence" report
5. **Look for green "Evidence Attached" section**
6. **Click "View Evidence 1" button**
7. Image should open in new tab!

---

## 🔍 Debugging

### Check 1: Is evidence in database?
Run this SQL:
```sql
SELECT * FROM report_evidence ORDER BY evidence_id DESC LIMIT 5;
```

Should show recent uploads.

### Check 2: Is file in uploads folder?
Check: `server/uploads/`

Should have image files like `1234567890.jpg`

### Check 3: Check browser console
1. Open admin dashboard
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors

### Check 4: Check backend response
In browser console, type:
```javascript
console.log(allReportsData);
```

Look for `evidence_files` and `evidence_types` fields.

---

## 📊 Expected Output

### In Admin Dashboard:
```
┌─────────────────────────────────────┐
│ Test Evidence [pending]             │
│ #CR-2024-1234                       │
├─────────────────────────────────────┤
│ Testing photo                       │
├─────────────────────────────────────┤
│ 📎 Evidence Attached:               │ ← Should see this!
│                                     │
│ [🖼️ View Evidence 1 🔗]             │ ← Green button
│                                     │
└─────────────────────────────────────┘
```

### When Clicked:
- New tab opens
- URL: `http://localhost:3000/uploads/filename.jpg`
- Image displays

---

## ❌ If Still Not Working

### Option 1: Check SQL Query
The backend query should include:
```sql
GROUP_CONCAT(e.file_path) as evidence_files,
GROUP_CONCAT(e.file_type) as evidence_types
```

### Option 2: Hard Refresh
- Press `Ctrl + Shift + R` in browser
- Clears cache

### Option 3: Check Console Errors
- F12 → Console tab
- Look for JavaScript errors

### Option 4: Verify Backend Code
Check `server/routes/reports.js`:
- Line ~70: Should save to `report_evidence` table
- Line ~105: Should JOIN with `report_evidence`

---

## 🎯 Quick Verification

Run this in browser console on admin page:
```javascript
// Check if reports have evidence
fetch('http://localhost:3000/api/reports/all', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(r => r.json())
.then(data => {
    console.log('Reports:', data);
    console.log('First report evidence:', data[0]?.evidence_files);
});
```

Should show evidence_files if present.

---

## ✅ Success Indicators

- [ ] Backend restarts without errors
- [ ] Can submit report with photo
- [ ] Photo appears in `server/uploads/`
- [ ] Entry in `report_evidence` table
- [ ] Admin dashboard loads
- [ ] Green "Evidence Attached" section visible
- [ ] "View Evidence" button appears
- [ ] Clicking button opens image

---

## 🆘 Still Having Issues?

1. **Restart everything:**
   ```bash
   # Stop all services
   # Restart backend: cd server && npm start
   # Refresh browser with Ctrl+Shift+R
   ```

2. **Check file permissions:**
   - Make sure `server/uploads/` folder exists
   - Make sure it's writable

3. **Submit a brand new report:**
   - Old reports won't have evidence
   - Must submit NEW report after code changes

---

**The evidence display should now work!** 🎉

If you still don't see it, the report might not have evidence attached. Try submitting a NEW report with a photo.
