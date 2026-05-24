@echo off
color 0B
title Gemini AI Service - Port 5000

echo.
echo ========================================
echo   GEMINI AI CLASSIFICATION SERVICE
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo [1/3] Checking Python packages...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
) else (
    echo     OK - Packages installed
)
echo.

echo [2/3] Checking Gemini API Key...
findstr /C:"GEMINI_API_KEY" ..\server\.env >nul 2>&1
if errorlevel 1 (
    echo WARNING: GEMINI_API_KEY not found in server/.env
    echo Service will use rule-based classification
) else (
    echo     OK - API Key configured
)
echo.

echo [3/3] Starting Gemini Service...
echo.
echo ========================================
echo   SERVICE STARTING ON PORT 5000
echo ========================================
echo.
echo Keep this window open!
echo.

python gemini_service.py

pause
