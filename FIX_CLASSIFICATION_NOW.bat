@echo off
color 0E
title Fix Classification Issue - Quick Setup

echo.
echo ========================================
echo   FIX CLASSIFICATION ISSUE
echo ========================================
echo.
echo This script will:
echo   1. Install Python packages
echo   2. Start Gemini AI service
echo   3. Reclassify all reports
echo.
pause

REM Get script directory
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo.
echo [Step 1/3] Installing Python packages...
echo.
cd ml-model
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)
echo     OK - Packages installed
cd ..

echo.
echo [Step 2/3] Starting ML Classification Service...
echo.
start "ML Classification Service" cmd /k "cd /d "%SCRIPT_DIR%ml-model" && python predict.py"
echo Waiting for service to start...
timeout /t 5 /nobreak >nul

REM Check if service is running
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo ERROR: Service failed to start
    echo Please check the ML Classification Service window for errors
    pause
    exit /b 1
)
echo     OK - Service is running

echo.
echo [Step 3/3] Reclassifying all reports...
echo.
cd server
node reclassify_reports.js
cd ..

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo All reports have been reclassified!
echo.
echo Next steps:
echo   1. Keep the ML Classification Service window open
echo   2. Refresh your admin dashboard (Ctrl + Shift + R)
echo   3. All reports should now show proper classifications
echo.
echo From now on, always start services with:
echo   START_ALL_SERVICES.bat
echo.
pause
