@echo off
title Crime Reporting System - Startup
color 0A

echo.
echo ============================================================
echo    CRIME REPORTING SYSTEM - COMPLETE STARTUP
echo ============================================================
echo.
echo This will start:
echo   1. ML Classification Service (Port 5000)
echo   2. Node.js Backend Server (Port 3000)
echo.
echo Press Ctrl+C in any window to stop that service
echo.
pause

REM Get script directory
set SCRIPT_DIR=%~dp0

echo.
echo [1/2] Starting ML Classification Service...
echo ============================================================
start "ML Service - Port 5000" cmd /k "cd /d "%SCRIPT_DIR%ml-model" && python predict.py"

echo Waiting 5 seconds for ML service to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Node.js Backend Server...
echo ============================================================
start "Backend Server - Port 3000" cmd /k "cd /d "%SCRIPT_DIR%server" && npm start"

echo.
echo ============================================================
echo    ALL SERVICES STARTED!
echo ============================================================
echo.
echo Services running:
echo   - ML Service:  http://localhost:5000
echo   - Backend:     http://localhost:3000
echo   - Frontend:    http://localhost:3000 (served by backend)
echo.
echo Next steps:
echo   1. Wait 10 seconds for all services to start
echo   2. Open browser: http://localhost:3000
echo   3. Register/Login and submit a crime report
echo   4. Check that crime type is classified automatically
echo.
echo To stop services: Close the terminal windows
echo.
pause
