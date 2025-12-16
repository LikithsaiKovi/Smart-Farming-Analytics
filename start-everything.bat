@echo off
echo ========================================
echo Smart Farming Analytics - Complete Setup
echo ========================================
echo.

echo Step 1: Starting Backend Server...
cd server
start "Backend Server" cmd /k "node server.js"
cd ..

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Application Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000 (or 3001)
echo Backend: http://localhost:5000
echo.
echo Features:
echo - Real Email OTP Authentication
echo - Weather API Integration
echo - Responsive Design
echo - Secure User Management
echo.
echo To configure email:
echo 1. Edit server/.env file
echo 2. Add your Gmail credentials
echo 3. Restart backend server
echo.
echo Press any key to exit...
pause > nul
