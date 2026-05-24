@echo off
color 0A
title SafeCity - Starting All Services

echo.
echo ========================================
echo    SAFECITY - STARTUP SCRIPT
echo ========================================
echo.
echo Starting all services...
echo.

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/3] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)
echo     OK - Python found
echo.

echo [2/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo     OK - Node.js found
echo.

echo [3/3] Checking MySQL...
echo     Make sure MySQL is running on port 3306
echo.

echo ========================================
echo    STARTING SERVICES
echo ========================================
echo.

REM Start Gemini AI Service in new window
echo Starting ML Classification Service (Port 5000)...
start "ML Classification Service - Port 5000" cmd /k "cd /d "%SCRIPT_DIR%ml-model" && python predict.py"
timeout /t 3 /nobreak >nul

REM Start Node.js Backend in new window
echo Starting Node.js Backend (Port 3000)...
start "Node.js Backend - Port 3000" cmd /k "cd /d "%SCRIPT_DIR%server" && npm start"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    SERVICES STARTED!
echo ========================================
echo.
echo Two terminal windows have been opened:
echo   1. ML Classification Service (Port 5000)
echo   2. Node.js Backend (Port 3000)
echo.
echo IMPORTANT: Keep both windows open!
echo.
echo ========================================
echo    OPENING APPLICATION
echo ========================================
echo.
echo Waiting for services to initialize...
timeout /t 5 /nobreak >nul

echo Opening SafeCity in your browser...
start "" "%SCRIPT_DIR%client\index.html"

echo.
echo ========================================
echo    READY TO USE!
echo ========================================
echo.
echo Your SafeCity application is now running!
echo.
echo URLs:
echo   - Main App:        file:///%SCRIPT_DIR%client\index.html
echo   - Backend API:     http://localhost:3000/api
echo   - ML Service:      http://localhost:5000
echo   - Health Check:    http://localhost:5000/health
echo.
echo To stop services:
echo   - Close both terminal windows
echo   - Or press Ctrl+C in each window
echo.
echo ========================================
echo.
pause
