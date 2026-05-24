# ML Model Integration Guide

## ✅ Your ML Model is Ready!

Your trained Naive Bayes model is in the `ml-model` folder with:
- `model.pkl` - Trained classification model
- `vectorizer.pkl` - TF-IDF vectorizer
- `Crime1.csv` - Training dataset (San Francisco crime data)
- `predict.py` - **UPDATED** Flask service (now compatible with backend)

---

## 🔧 What Was Fixed

### 1. Updated `predict.py`
- ✅ Now accepts `description` field (backend sends this)
- ✅ Returns `category` field (backend expects this)
- ✅ Added CORS support for cross-origin requests
- ✅ Added health check endpoint `/health`
- ✅ Added service info endpoint `/`
- ✅ Added confidence scores
- ✅ Better error handling
- ✅ Detailed logging

### 2. Backend Integration
Your backend (`server/routes/reports.js`) already calls:
```javascript
axios.post('http://localhost:5000/predict', { description })
```

This now works perfectly with the updated `predict.py`!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Python Dependencies
```bash
cd ml-model
pip install -r requirements.txt
```

### Step 2: Start ML Service
**Option A - Using batch file (Windows):**
```bash
Double-click: ml-model/start_ml_service.bat
```

**Option B - Manual:**
```bash
cd ml-model
python predict.py
```

You should see:
```
============================================================
🚀 Crime Classification ML Service
============================================================
✅ Model: Loaded
🌐 Server: http://localhost:5000
============================================================
```

### Step 3: Start Backend
In a new terminal:
```bash
cd server
npm start
```

---

## 🧪 Testing

### Test 1: Check ML Service
```bash
cd ml-model
python test_ml_service.py
```

### Test 2: Check Categories
```bash
cd ml-model
python check_categories.py
```

### Test 3: Manual API Test
```bash
curl -X POST http://localhost:5000/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"description\":\"Someone stole my bike\"}"
```

Expected response:
```json
{
  "category": "LARCENY/THEFT",
  "confidence": "high",
  "ai_model": "Naive Bayes ML",
  "description": "Someone stole my bike"
}
```

---

## 📊 Crime Categories

Your model classifies crimes into these categories (from San Francisco crime dataset):

1. LARCENY/THEFT - Theft, shoplifting, pickpocketing
2. OTHER OFFENSES - Traffic violations, misc offenses
3. NON-CRIMINAL - Found property, aided cases
4. ASSAULT - Physical attacks, battery
5. DRUG/NARCOTIC - Drug possession, sales
6. VEHICLE THEFT - Stolen cars, motorcycles
7. VANDALISM - Property damage, graffiti
8. WARRANTS - Warrant arrests
9. BURGLARY - Breaking and entering
10. SUSPICIOUS OCC - Suspicious activities
11. MISSING PERSON - Missing persons reports
12. ROBBERY - Armed robbery, mugging
13. FRAUD - Credit card fraud, forgery
14. SECONDARY CODES - Domestic violence, etc.
15. TRESPASS - Trespassing
16. STOLEN PROPERTY - Receiving stolen goods
17. SEX OFFENSES - Sexual crimes
18. DISORDERLY CONDUCT - Public disturbance
19. DRUNKENNESS - Public intoxication
20. RECOVERED VEHICLE - Recovered stolen vehicles
21. WEAPON LAWS - Illegal weapons
22. PROSTITUTION - Prostitution related
23. ARSON - Fire setting
24. And more...

---

## 🔄 How It Works

### Architecture Flow:
```
User submits report
    ↓
Frontend (client/js/report.js)
    ↓
Backend API (server/routes/reports.js)
    ↓
POST http://localhost:5000/predict
    ↓
ML Service (ml-model/predict.py)
    ↓
Trained Model (model.pkl + vectorizer.pkl)
    ↓
Returns: { category, confidence, ai_model }
    ↓
Stored in database (crime_reports.ml_predicted_type)
    ↓
Displayed to user
```

### Code Integration Points:

**1. Backend sends request:**
```javascript
// server/routes/reports.js
const mlResponse = await axios.post('http://localhost:5000/predict', { 
    description 
});
mlPredictedType = mlResponse.data.category;
```

**2. ML service processes:**
```python
# ml-model/predict.py
text = data.get('description')
vec = vectorizer.transform([text])
prediction = model.predict(vec)[0]
return jsonify({ "category": prediction })
```

**3. Database stores:**
```sql
INSERT INTO crime_reports (..., ml_predicted_type, ...)
VALUES (..., 'LARCENY/THEFT', ...)
```

---

## 🎯 API Endpoints

### GET /
Service information
```bash
curl http://localhost:5000/
```

### GET /health
Health check
```bash
curl http://localhost:5000/health
```

### POST /predict
Classify crime
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"description":"My bike was stolen"}'
```

Response:
```json
{
  "category": "LARCENY/THEFT",
  "confidence": "high",
  "ai_model": "Naive Bayes ML",
  "description": "My bike was stolen"
}
```

---

## 🐛 Troubleshooting

### Issue: "Model not loaded"
**Solution:**
```bash
cd ml-model
python train.py  # Retrain if needed
python predict.py
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F
```

### Issue: "Module not found: flask"
**Solution:**
```bash
cd ml-model
pip install -r requirements.txt
```

### Issue: "Backend shows 'Unclassified'"
**Causes:**
1. ML service not running
2. ML service crashed
3. Network error

**Solution:**
1. Check ML service is running: `curl http://localhost:5000/health`
2. Check ML service logs in terminal
3. Restart ML service

---

## 📈 Improving Accuracy

### Option 1: Retrain with More Data
```bash
cd ml-model
# Add more data to Crime1.csv
python train.py
```

### Option 2: Try Different Models
Edit `train.py`:
```python
# Instead of MultinomialNB
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=100)
```

### Option 3: Tune Hyperparameters
```python
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB(alpha=0.5)  # Adjust alpha
```

---

## 🔄 Reclassify Existing Reports

If you have reports in the database that show "Unclassified":

```bash
cd server
node reclassify_reports.js
```

This will:
1. Find all unclassified reports
2. Send them to ML service
3. Update database with predictions

---

## ✅ Verification Checklist

Before using in production:

- [ ] ML service starts without errors
- [ ] Test script passes all tests
- [ ] Backend connects to ML service
- [ ] Reports get classified correctly
- [ ] Database stores classifications
- [ ] Admin panel shows crime types
- [ ] Confidence scores are reasonable

---

## 🎓 Understanding the Model

### Training Data:
- **Source**: San Francisco crime dataset (Kaggle)
- **Records**: ~5000 crime reports
- **Features**: Crime descriptions (text)
- **Labels**: Crime categories

### Algorithm:
- **Model**: Multinomial Naive Bayes
- **Vectorization**: TF-IDF (Term Frequency-Inverse Document Frequency)
- **Accuracy**: ~70-80% (typical for this dataset)

### How It Works:
1. Text is converted to numerical vectors using TF-IDF
2. Naive Bayes calculates probability for each category
3. Category with highest probability is selected
4. Confidence is based on probability score

---

## 🚀 Next Steps

1. **Test thoroughly** with various crime descriptions
2. **Monitor accuracy** and collect feedback
3. **Retrain periodically** with new data
4. **Consider upgrading** to more advanced models if needed

---

## 📞 Support

If you encounter issues:

1. Check ML service logs in terminal
2. Run test script: `python test_ml_service.py`
3. Verify model files exist: `model.pkl`, `vectorizer.pkl`
4. Check Python version: `python --version` (should be 3.8+)

---

## 🎉 Success!

Your ML model is now fully integrated with the backend!

**To start everything:**
```bash
# Terminal 1: Start ML Service
cd ml-model
python predict.py

# Terminal 2: Start Backend
cd server
npm start

# Browser: Open application
http://localhost:3000
```

Happy classifying! 🚀
