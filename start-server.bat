@echo off
REM Simple Backend Startup Script
echo ========================================
echo   Starting Fraud Evidence Backend
echo ========================================
echo.

REM Navigate to Backend directory (handle case sensitivity)
cd /d "%~dp0Backend"

REM Check if we're in the right directory
if not exist "server.js" (
    echo ERROR: server.js not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Starting server...
echo.
echo Server will run on: http://localhost:5050
echo Press Ctrl+C to stop the server
echo.

node server.js

pause

