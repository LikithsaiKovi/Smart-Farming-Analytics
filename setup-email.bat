@echo off
echo ========================================
echo Email Setup for AgroAnalytics
echo ========================================
echo.

echo Creating .env file in server directory...
cd server

echo # Email Configuration (REQUIRED for real OTP emails) > .env
echo SMTP_HOST=smtp.gmail.com >> .env
echo SMTP_PORT=587 >> .env
echo SMTP_USER=your-email@gmail.com >> .env
echo SMTP_PASS=your-app-password >> .env
echo. >> .env
echo # OpenWeather API >> .env
echo OPENWEATHER_API_KEY=2170cf9f72b3eee31fdac25765223afd >> .env
echo. >> .env
echo # JWT Secret >> .env
echo JWT_SECRET=your-super-secret-jwt-key-for-agroanalytics-2024 >> .env
echo. >> .env
echo # Server Configuration >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env

echo.
echo ========================================
echo Email Configuration Created!
echo ========================================
echo.
echo IMPORTANT: Update server/.env with your real email:
echo.
echo 1. Open server/.env file
echo 2. Replace 'your-email@gmail.com' with your Gmail
echo 3. Replace 'your-app-password' with your Gmail App Password
echo.
echo Gmail Setup:
echo - Enable 2-Factor Authentication
echo - Generate App Password (Security > 2-Step Verification > App passwords)
echo - Use the app password (not your regular password)
echo.
echo After updating .env, restart the server:
echo   cd server
echo   node server.js
echo.
echo Press any key to continue...
pause > nul
