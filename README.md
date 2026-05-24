# Crime Reporting and Public Safety Management System

## Overview
A web-based system for citizens to report crimes online and for police to manage complaints. Features include:
- **Citizen Portal**: Report crimes, upload evidence, track status.
- **Police/Admin Dashboard**: Manage and update case status.
- **AI Integration**: Helper ML model (Naive Bayes) to suggest crime categories based on description.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Service**: Google Gemini AI (or Python Flask with scikit-learn)

## Setup Instructions

### Prerequisites
- Node.js installed
- Python installed (3.8 or higher)
- MySQL Server installed and running
- Google Gemini API Key (Get from: https://makersuite.google.com/app/apikey)

### 1. Database Setup
1. Log in to MySQL: `mysql -u root -p`
2. Create database: `CREATE DATABASE crime_reporting_db;`
3. Select database: `USE crime_reporting_db;`
4. Run the schema script: `SOURCE ./database/schema.sql;`

### 2. AI Classification Service (Gemini - Recommended)

#### Option A: Gemini AI Service (Better Accuracy)
1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open `server/.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Navigate to `ml/` folder
4. Install dependencies: `pip install -r requirements_gemini.txt`
5. Start the service:
   - **Windows**: Double-click `start_gemini_service.bat`
   - **Manual**: `python gemini_service.py`
6. Service runs on `http://localhost:5000`

📖 **Detailed Guide**: See `ml/GEMINI_SETUP.md` for complete instructions

#### Option B: Traditional ML Service (Fallback)
1. Navigate to `ml/` folder
2. Install dependencies: `pip install -r requirements.txt`
3. Train the model: `python train_model.py`
4. Run the service: `python ml_service.py`
5. Service runs on `http://localhost:5000`

### 3. Backend (Node.js)
1. Navigate to `server/` folder.
2. Install dependencies: `npm install`
3. Configure `.env` file (see `.env.example`).
4. Run the server: `npm start`
   - Server runs on `http://localhost:3000`

### 4. Frontend
1. Open `client/index.html` in your browser.
   - Or serve using a live server extension.

## Folder Structure
- `client/`: Frontend files
- `server/`: Backend Node.js code
- `database/`: SQL scripts
- `ml/`: Python ML service

## Default Credentials (for testing)
- **Admin**: `admin@police.com` / `admin123` (Manually insert into DB or register via API)
