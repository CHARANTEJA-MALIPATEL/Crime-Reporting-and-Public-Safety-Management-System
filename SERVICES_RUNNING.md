# ✅ Services Are Now Running!

## Current Status

Both required services are now running:

### 1. Gemini AI Service ✅
- **Port**: 5000
- **Model**: gemini-2.5-flash
- **Status**: Running
- **Health Check**: http://localhost:5000/health

### 2. Node.js Backend ✅
- **Port**: 3000
- **Status**: Running
- **API Base**: http://localhost:3000/api

## How to Access the Application

### Option 1: Direct File Access (Recommended)
1. Navigate to the `client` folder
2. Double-click `index.html` to open in your browser
3. Or open `admin.html` for admin dashboard

### Option 2: Use the Batch File
Double-click `START_ALL_SERVICES.bat` to:
- Start both services automatically
- Open the application in your browser

## Admin Dashboard Access

1. **Open**: `client/admin.html` in your browser
2. **Login** with admin credentials
3. **View Reports**: All reports should now load with AI classifications

### If Reports Still Don't Load:

1. **Check Browser Console** (F12):
   - Look for any red error messages
   - Check if API calls are failing

2. **Verify Services Are Running**:
   ```bash
   # Check Gemini service
   curl http://localhost:5000/health
   
   # Check Node.js backend
   curl http://localhost:3000/api/reports/all
   ```

3. **Check Network Tab** (F12 → Network):
   - Look for failed requests to `http://localhost:3000/api/reports/all`
   - Status should be 200 (success)

4. **Verify You're Logged In**:
   - Open browser console (F12)
   - Type: `localStorage.getItem('token')`
   - Should return a token string (not null)

## Common Issues & Solutions

### Issue: "Failed to load reports"
**Solution**: 
- Make sure Node.js backend is running on port 3000
- Check if you're logged in as admin
- Verify token in localStorage

### Issue: "Port 3000 already in use"
**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>

# Restart the server
cd server
npm start
```

### Issue: "Classifications showing 'Unclassified'"
**Solution**:
- Make sure Gemini service is running on port 5000
- Run reclassification script:
  ```bash
  cd server
  node reclassify_reports.js
  ```

### Issue: "Rate limit exceeded"
**Solution**:
- Wait 30 seconds (free tier: 5 requests/minute)
- Retry the operation
- Consider upgrading to paid tier

## Testing the Setup

### 1. Test Gemini Service
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "healthy",
  "gemini_configured": true,
  "service": "gemini_crime_classifier",
  "model": "gemini-2.5-flash"
}
```

### 2. Test Backend API
Open browser and navigate to:
```
http://localhost:3000/api/reports/all
```
(You'll need to be logged in with a valid token)

### 3. Test Admin Dashboard
1. Open `client/admin.html`
2. Login with admin credentials
3. Reports should load with colored badges showing crime types

## Stopping the Services

### Option 1: Close Terminal Windows
- Close the Gemini AI Service window
- Close the Node.js Backend window

### Option 2: Use Ctrl+C
- Press `Ctrl+C` in each terminal window
- Confirm with `Y` if prompted

## Restarting Services

### Quick Restart:
```bash
# Double-click this file:
START_ALL_SERVICES.bat
```

### Manual Restart:

**Terminal 1 - Gemini Service:**
```bash
cd ml
python gemini_service.py
```

**Terminal 2 - Node.js Backend:**
```bash
cd server
npm start
```

## Verification Checklist

Before using the application, verify:

- [ ] Gemini service running on port 5000
- [ ] Node.js backend running on port 3000
- [ ] MySQL database running on port 3306
- [ ] Can access http://localhost:5000/health
- [ ] Can open client/admin.html in browser
- [ ] Can login to admin dashboard
- [ ] Reports load without errors

## Next Steps

1. **Refresh Admin Dashboard**: Press `Ctrl + Shift + R`
2. **View Classifications**: All reports should show proper crime types
3. **Submit New Report**: Test with a new crime report
4. **Verify Classification**: Check if new report is classified correctly

## Support

If you continue to have issues:

1. Check the terminal windows for error messages
2. Look at browser console (F12) for JavaScript errors
3. Verify all environment variables in `server/.env`
4. Ensure MySQL database is accessible
5. Check that all npm packages are installed: `cd server && npm install`

---

**Status**: ✅ All services running and ready to use!

**Last Updated**: Just now

**Services**:
- Gemini AI: Running on port 5000
- Node.js Backend: Running on port 3000
- Frontend: Available at client/index.html
