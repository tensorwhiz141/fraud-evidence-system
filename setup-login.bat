@echo off
echo ========================================
echo   Setting Up Login System
echo ========================================
echo.

REM Navigate to Backend
cd /d "%~dp0Backend"

echo [Step 1/3] Creating .env file...
if exist ".env" (
    echo   .env already exists
) else (
    (
        echo NODE_ENV=development
        echo PORT=5050
        echo MONGODB_URI=mongodb://localhost:27017/fraud_evidence
        echo JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-in-production
        echo TRANSACTION_API_URL=http://192.168.0.68:8080/api/transaction-data
    ) > .env
    echo   ✅ .env file created
)
echo.

echo [Step 2/3] Checking MongoDB...
docker ps | findstr mongodb >nul 2>&1
if errorlevel 1 (
    echo   MongoDB not running. Starting MongoDB with Docker...
    docker run -d -p 27017:27017 --name mongodb mongo:latest >nul 2>&1
    if errorlevel 1 (
        echo   ⚠️  Could not start MongoDB with Docker
        echo   Please install MongoDB manually or start Docker
        echo.
        echo   Install MongoDB from: https://www.mongodb.com/try/download/community
        echo   Or ensure Docker Desktop is running
        pause
        exit /b 1
    )
    echo   ✅ MongoDB started
    timeout /t 3 /nobreak >nul
) else (
    echo   ✅ MongoDB already running
)
echo.

echo [Step 3/3] Creating test users...
node scripts/create-test-users.js
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now login with:
echo.
echo   Admin:
echo     Email: admin@fraud.com
echo     Password: admin123
echo.
echo   Investigator:
echo     Email: investigator@fraud.com
echo     Password: invest123
echo.
echo Next steps:
echo   1. Run: start-fullstack.bat
echo   2. Open: http://localhost:3000
echo   3. Login with admin credentials
echo.
pause

