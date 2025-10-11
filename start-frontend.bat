@echo off
REM Frontend Startup Script
echo ========================================
echo   Starting Fraud Evidence Frontend
echo ========================================
echo.

cd /d "%~dp0Frontend"

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Starting React development server...
echo.
echo Frontend will run on: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start

pause

