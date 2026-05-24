# 🚀 How to Start Your Crime Reporting System

## Simple 3-Step Guide

---

## 📋 Prerequisites (One-Time Setup)

### Step 1: Install Python Dependencies (First Time Only)
Open Command Prompt and run:
```bash
cd F:\charan\Crime_Reporting\ml-model
pip install -r requirements.txt
```

### Step 2: Install Node.js Dependencies (First Time Only)
```bash
cd F:\charan\Crime_Reporting\server
npm install
```

---

## 🎯 Starting the System (Every Time)

You need to start **TWO** services:
1. ML Model Service (Port 5000)
2. Backend Server (Port 3000)

### 🔥 EASIEST WAY - Use the Batch File

**Just double-click this file:**
```
F:\charan\Crime_Reporting\START_ML_AND_BACKEND.bat
```

This will:
- ✅ Start ML service automatically
- ✅ Start backend automatically
- ✅ Open in separate windows

**That's it! You're done!** 🎉

---

## 🔧 MANUAL WAY (If you prefer)

### Step 1: Start ML Model Service

**Open Command Prompt #1:**
```bash
cd F:\charan\Crime_Reporting\ml-model
python predict.py
```

**You should see:**
```
✅ Model loaded successfully!
============================================================
🚀 Crime Classification ML Service
============================================================
✅ Model: Loaded
🌐 Server: http://localhost:5000
============================================================
```

**✅ Leave this window OPEN!** Don't close it!

---

### Step 2: Start Backend Server

**Open Command Prompt #2 (NEW WINDOW):**
```bash
cd F:\charan\Crime_Reporting\server
npm start
```

**You should see:**
```
Server is running on port 3000
```

**✅ Leave this window OPEN too!** Don't close it!

---

### Step 3: Open Your Browser

Open your browser and go to:
```
http://localhost:3000
```

**🎉 Your application is now running!**

---

## 📊 Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│ Terminal Window 1                                       │
│ ─────────────────────────────────────────────────────── │
│ F:\charan\Crime_Reporting\ml-model> python predict.py  │
│                                                         │
│ ✅ Model loaded successfully!                          │
│ 🌐 Server: http://localhost:5000                       │
│                                                         │
│ ⚠️ KEEP THIS WINDOW OPEN!                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Terminal Window 2                                       │
│ ─────────────────────────────────────────────────────── │
│ F:\charan\Crime_Reporting\server> npm start            │
│                                                         │
│ Server is running on port 3000                         │
│                                                         │
│ ⚠️ KEEP THIS WINDOW OPEN!                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Browser                                                 │
│ ─────────────────────────────────────────────────────── │
│ http://localhost:3000                                   │
│                                                         │
│ 🎉 Your Crime Reporting System!                        │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ How to Check if Everything is Working

### Check 1: ML Service
Open browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Check 2: Backend
Open browser and go to:
```
http://localhost:3000
```

You should see your SafeCity homepage!

### Check 3: Full System Test
```bash
cd F:\charan\Crime_Reporting
python verify_integration.py
```

All checks should pass! ✅

---

## 🛑 How to Stop Everything

### If using batch file:
- Close both terminal windows that opened

### If started manually:
- Go to Terminal Window 1 (ML Service)
- Press `Ctrl + C`
- Go to Terminal Window 2 (Backend)
- Press `Ctrl + C`

---

## 🔄 Restart After Stopping

Just repeat the starting steps:
- Double-click `START_ML_AND_BACKEND.bat`
- OR manually start both services again

---

## ❓ Common Questions

### Q: Which one should I start first?
**A:** It doesn't matter, but ML service first is better.

### Q: Can I close the terminal windows?
**A:** NO! Keep both open while using the application.

### Q: What if I see errors?
**A:** Check the troubleshooting section below.

### Q: Do I need to restart after making changes?
**A:** 
- Frontend changes (HTML/CSS/JS): Just refresh browser
- Backend changes: Restart backend (Ctrl+C, then npm start)
- ML model changes: Restart ML service (Ctrl+C, then python predict.py)

---

## 🐛 Troubleshooting

### Problem: "Port 5000 already in use"
**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID from above)
taskkill /PID XXXX /F

# Try starting again
cd ml-model
python predict.py
```

### Problem: "Port 3000 already in use"
**Solution:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace XXXX with PID from above)
taskkill /PID XXXX /F

# Try starting again
cd server
npm start
```

### Problem: "Module not found" (Python)
**Solution:**
```bash
cd ml-model
pip install -r requirements.txt
```

### Problem: "Module not found" (Node.js)
**Solution:**
```bash
cd server
npm install
```

### Problem: Backend shows "Unclassified" for reports
**Solution:**
- Make sure ML service is running!
- Check: http://localhost:5000/health
- If not running, start it: `cd ml-model && python predict.py`

---

## 📝 Quick Reference Commands

### Start ML Service:
```bash
cd F:\charan\Crime_Reporting\ml-model
python predict.py
```

### Start Backend:
```bash
cd F:\charan\Crime_Reporting\server
npm start
```

### Start Both (Easy Way):
```bash
# Just double-click:
F:\charan\Crime_Reporting\START_ML_AND_BACKEND.bat
```

### Stop Services:
```
Press Ctrl + C in each terminal window
```

### Check ML Service:
```
http://localhost:5000/health
```

### Check Backend:
```
http://localhost:3000
```

### Verify Everything:
```bash
cd F:\charan\Crime_Reporting
python verify_integration.py
```

---

## 🎯 Summary

### To Start Everything:
1. **Double-click:** `START_ML_AND_BACKEND.bat`
2. **Wait:** 10 seconds for services to start
3. **Open browser:** http://localhost:3000
4. **Done!** 🎉

### To Stop Everything:
1. Close the terminal windows
2. Done!

### To Use the Application:
1. Register a new account
2. Login
3. Submit a crime report
4. Watch it get classified automatically!

---

## 🎊 That's It!

You now know how to:
- ✅ Start the ML service
- ✅ Start the backend
- ✅ Check if everything is working
- ✅ Stop the services
- ✅ Troubleshoot common issues

**Need help?** Check the troubleshooting section or run `python verify_integration.py`

Happy coding! 🚀
