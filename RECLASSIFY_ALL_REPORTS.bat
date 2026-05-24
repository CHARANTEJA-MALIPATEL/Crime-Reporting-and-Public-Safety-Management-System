@echo off
color 0E
title Reclassify Reports with Gemini AI

echo.
echo ========================================
echo   RECLASSIFY REPORTS WITH GEMINI AI
echo ========================================
echo.

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [Step 1] Checking if Gemini service is running...
curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: Gemini Service Not Running!
    echo ========================================
    echo.
    echo Please start the Gemini AI service first:
    echo   1. Open a new terminal
    echo   2. cd ml
    echo   3. python gemini_service.py
    echo.
    echo Or double-click: ml/start_gemini_service.bat
    echo.
    pause
    exit /b 1
)

echo     OK - Gemini service is running
echo.

echo [Step 2] Running reclassification script...
echo.
cd server
node reclassify_reports.js

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
pause
