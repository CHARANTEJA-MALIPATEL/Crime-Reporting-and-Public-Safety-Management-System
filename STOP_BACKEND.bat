@echo off
echo ========================================
echo Stopping Backend Server on Port 3000
echo ========================================
echo.

FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3000') DO (
    echo Found process: %%P
    taskkill /F /PID %%P
)

echo.
echo ========================================
echo Backend stopped!
echo ========================================
pause
