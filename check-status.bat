@echo off
echo ========================================
echo Server Status Check
echo ========================================
echo.

echo Checking Backend Server (Port 5000)...
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ✅ Backend Server is RUNNING
) else (
    echo ❌ Backend Server is NOT running
)

echo.
echo Checking Frontend Server (Port 3001)...
netstat -ano | findstr :3001
if %errorlevel% equ 0 (
    echo ✅ Frontend Server is RUNNING
) else (
    echo ❌ Frontend Server is NOT running
)

echo.
echo ========================================
echo Status Check Complete
echo ========================================
echo.
echo To start servers:
echo 1. Run: start.bat
echo 2. Or manually:
echo    - Backend: cd server && node server.js
echo    - Frontend: npm run dev
echo.
pause
