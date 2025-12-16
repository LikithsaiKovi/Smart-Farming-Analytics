@echo off
echo Starting Smart Farming Analytics Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && node server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Application is starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul
