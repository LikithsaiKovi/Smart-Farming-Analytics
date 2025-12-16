@echo off
echo ========================================
echo Smart Farming Analytics - START NOW
echo ========================================
echo.

echo Starting Backend Server from CORRECT directory...
cd server
start "Backend Server" cmd /k "node server.js"
cd ..

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo APPLICATION IS NOW RUNNING!
echo ========================================
echo.
echo Frontend: http://localhost:3001
echo Backend: http://localhost:5000
echo.
echo TEST YOUR APPLICATION:
echo 1. Open http://localhost:3001 in your browser
echo 2. Sign up with any details
echo 3. Use OTP "123456" for demo mode
echo 4. Enjoy your Smart Farming Analytics!
echo.
echo Press any key to exit...
pause > nul
