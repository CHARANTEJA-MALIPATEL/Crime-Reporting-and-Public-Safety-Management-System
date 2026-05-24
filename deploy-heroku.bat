@echo off
color 0A
title Deploy to Heroku

echo.
echo ========================================
echo   SAFECITY - HEROKU DEPLOYMENT
echo ========================================
echo.

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Heroku CLI is not installed!
    echo.
    echo Please install from: https://devcenter.heroku.com/articles/heroku-cli
    echo.
    pause
    exit /b 1
)

echo [1/7] Logging into Heroku...
heroku login
if errorlevel 1 (
    echo ERROR: Failed to login to Heroku
    pause
    exit /b 1
)

echo.
echo [2/7] Creating Heroku app...
set /p APP_NAME="Enter your app name (e.g., safecity-yourname): "
heroku create %APP_NAME%

echo.
echo [3/7] Adding MySQL database...
heroku addons:create jawsdb:kitefin -a %APP_NAME%

echo.
echo [4/7] Setting environment variables...
set /p JWT_SECRET="Enter JWT secret key: "
heroku config:set JWT_SECRET=%JWT_SECRET% -a %APP_NAME%

set /p GEMINI_KEY="Enter Gemini API key (or press Enter to skip): "
if not "%GEMINI_KEY%"=="" (
    heroku config:set GEMINI_API_KEY=%GEMINI_KEY% -a %APP_NAME%
)

echo.
echo [5/7] Initializing Git repository...
if not exist .git (
    git init
    git add .
    git commit -m "Initial deployment to Heroku"
)

echo.
echo [6/7] Deploying to Heroku...
git push heroku main
if errorlevel 1 (
    echo.
    echo Trying master branch...
    git push heroku master
)

echo.
echo [7/7] Opening your app...
heroku open -a %APP_NAME%

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is now live at:
heroku info -a %APP_NAME% | findstr "Web URL"
echo.
echo To view logs: heroku logs --tail -a %APP_NAME%
echo To restart: heroku restart -a %APP_NAME%
echo.
pause
