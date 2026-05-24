# ML Classification Service

This service provides AI-powered crime classification using Google's Gemini AI.

## Quick Start

### Option 1: Double-click to start
```
start_service.bat
```

### Option 2: Manual start
```bash
pip install -r requirements.txt
python predict.py
```

## How to Use

1. **Start the service:**
   ```bash
   cd ml-model
   python predict.py
   ```

2. **The service will run on:** `http://localhost:5000`

3. **Keep the terminal window open** while using the application

## API Endpoints

### GET /
Service information

### GET /health
Health check - returns service status

### GET /categories
List all 18 crime categories

### POST /predict
Classify a crime description

**Request:**
```json
{
  "description": "Someone stole my bike"
}
```

**Response:**
```json
{
  "category": "Theft",
  "confidence": "high",
  "ai_model": "Gemini 2.0 Flash"
}
```

## Features

- **Gemini AI**: Uses Google's Gemini 2.0 Flash model for accurate classification
- **Fallback**: Rule-based classification if Gemini is unavailable
- **18 Crime Categories**: Theft, Burglary, Robbery, Assault, and more
- **Priority Keywords**: "stolen" always classifies as "Theft"

## Configuration (Optional)

Add your Gemini API key to `server/.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at: https://makersuite.google.com/app/apikey

**Note:** The service works WITHOUT an API key using rule-based classification!

## Crime Categories

1. Theft (Priority: "stolen", "stole")
2. Burglary
3. Robbery
4. Assault
5. Harassment
6. Cybercrime
7. Fraud
8. Vandalism
9. Drug-related
10. Domestic Violence
11. Sexual Offense
12. Murder/Homicide
13. Kidnapping
14. Arson
15. Traffic Violation
16. Public Disturbance
17. Trespassing
18. Other

## Testing

Test if the service is working:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "healthy", "gemini_configured": true}
```

## Troubleshooting

### Service won't start
- Check Python is installed: `python --version`
- Install packages: `pip install -r requirements.txt`
- Check port 5000 is not in use

### Classification not working
- Make sure service is running: `curl http://localhost:5000/health`
- Check API key in server/.env (optional)
- View service logs in the terminal window

### "Unclassified" reports
- Start this service BEFORE submitting reports
- Run reclassification: `node server/reclassify_reports.js`
- Or use: `RECLASSIFY_ALL_REPORTS.bat`

## Daily Usage

Always start this service before using the application:

```bash
cd ml-model
python predict.py
```

Or use the quick start:
```
Double-click: start_service.bat
```

Or start everything at once:
```
Double-click: START_ALL_SERVICES.bat (in root folder)
```
