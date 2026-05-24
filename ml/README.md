# Gemini AI Classification Service

This service provides AI-powered crime classification using Google's Gemini AI.

## Quick Start

### Option 1: Double-click to start
```
start_gemini_service.bat
```

### Option 2: Manual start
```bash
pip install -r requirements.txt
python gemini_service.py
```

## Features

- **Gemini AI**: Uses Google's Gemini 2.0 Flash model for accurate classification
- **Fallback**: Rule-based classification if Gemini is unavailable
- **18 Crime Categories**: Theft, Burglary, Robbery, Assault, and more
- **REST API**: Simple HTTP endpoints for classification

## API Endpoints

### GET /
Service information

### GET /health
Health check

### GET /categories
List all crime categories

### POST /predict
Classify a crime description

Request:
```json
{
  "description": "Someone stole my bike"
}
```

Response:
```json
{
  "category": "Theft",
  "confidence": "high",
  "ai_model": "Gemini 2.0 Flash"
}
```

## Configuration

Add your Gemini API key to `server/.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Get a free API key at: https://makersuite.google.com/app/apikey

## Troubleshooting

### Service won't start
- Check Python is installed: `python --version`
- Install packages: `pip install -r requirements.txt`
- Check port 5000 is not in use

### Classification not working
- Make sure service is running: `curl http://localhost:5000/health`
- Check API key in server/.env
- View service logs in the terminal window

### "Unclassified" reports
- Start this service BEFORE submitting reports
- Run reclassification: `node server/reclassify_reports.js`
- Or use: `RECLASSIFY_ALL_REPORTS.bat`

## Crime Categories

1. Theft
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
