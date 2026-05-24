# 🎯 START HERE - Fix "Unclassified" Reports

## The Problem
Your reports show "Unclassified" because the ML classification service isn't running.

## The Solution (Choose One)

---

## 🚀 OPTION 1: One-Click Fix (EASIEST)

### Just double-click this file:
```
FIX_CLASSIFICATION_NOW.bat
```

This will:
1. ✅ Install everything needed
2. ✅ Start the AI service
3. ✅ Fix all existing reports
4. ✅ Done in 2 minutes!

**Then refresh your browser (Ctrl + Shift + R)**

---

## 🔧 OPTION 2: Manual Fix (Step by Step)

### Step 1: Install Python Packages
Open terminal in project folder:
```bash
cd ml
pip install -r requirements.txt
```

### Step 2: Start the AI Service
```bash
python gemini_service.py
```

**Keep this window open!** You should see:
```
✅ Gemini API: Configured
🌐 Server: http://localhost:5000
```

### Step 3: Reclassify Reports
Open a NEW terminal:
```bash
cd server
node reclassify_reports.js
```

Wait for it to finish, then refresh your browser!

---

## 🧪 Test If It's Working

### Quick Test:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status": "healthy"}
```

### Full Test:
```bash
cd ml
python test_service.py
```

---

## 📋 What Happens Next?

### Before Fix:
```
Report: Bike Stolen
Classification: Unclassified ❌
```

### After Fix:
```
Report: Bike Stolen
Classification: 🔓 Theft ✅
Model: Gemini 2.0 Flash
```

---

## 🎮 Daily Usage

### Every time you start working:

#### Option A - Easy Way:
```
Double-click: START_ALL_SERVICES.bat
```

#### Option B - Manual:
```bash
# Terminal 1
cd ml
python gemini_service.py

# Terminal 2
cd server
npm start
```

**Keep both terminals open while using the app!**

---

## ⚙️ Optional: Add Gemini API Key

For even better accuracy, add a Gemini API key:

1. Get free key: https://makersuite.google.com/app/apikey
2. Open `server/.env`
3. Add line: `GEMINI_API_KEY=your_key_here`
4. Restart the service

**Note:** It works fine WITHOUT the API key using rule-based classification!

---

## 🐛 Troubleshooting

### "Module not found: flask"
```bash
cd ml
pip install flask flask-cors google-generativeai python-dotenv
```

### "Port 5000 already in use"
- Close other programs using port 5000
- Or restart your computer

### "Connection refused"
- Make sure you started the Gemini service
- Check it's running: `curl http://localhost:5000/health`

### Still showing "Unclassified"
1. Check service is running
2. Run: `node server/reclassify_reports.js`
3. Hard refresh browser: `Ctrl + Shift + R`

---

## ✅ Success Checklist

After the fix, you should have:

- [ ] Gemini service running (port 5000)
- [ ] Backend running (port 3000)
- [ ] Health check passes
- [ ] Reports show crime types (not "Unclassified")
- [ ] Colored badges in admin dashboard
- [ ] New reports auto-classify

---

## 📚 More Help

- **Full Guide**: `CLASSIFICATION_FIXED.md`
- **Service Docs**: `ml/README.md`
- **Reclassify Guide**: `RECLASSIFY_REPORTS.md`

---

## 🎉 That's It!

Your classification system is now working!

### Remember:
- Always start the Gemini service BEFORE using the app
- Use `START_ALL_SERVICES.bat` for easy startup
- Keep service windows open while working

**Happy Crime Reporting! 🚔✨**
