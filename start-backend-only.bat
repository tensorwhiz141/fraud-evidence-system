@echo off
REM Node.js Backend Only (Fallback Mode)
REM This script starts just the Node.js backend without Python services

echo ============================================
echo   Starting Node.js Backend (Fallback Mode)
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

echo Starting Node.js Backend...
echo.
echo Note: BHIV Python services will not be started.
echo The system will run in fallback mode with limited AI features.
echo.

cd Backend
npm start

