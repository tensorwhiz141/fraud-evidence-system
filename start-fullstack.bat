@echo off
REM Start Both Backend and Frontend
echo ========================================
echo   Starting Full Stack Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Backend - Port 5050" cmd /k "cd /d %~dp0Backend && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend React App...
start "Frontend - Port 3000" cmd /k "cd /d %~dp0Frontend && npm start"

echo.
echo ========================================
echo   Full Stack Started!
echo ========================================
echo.
echo Backend:  http://localhost:5050
echo Frontend: http://localhost:3000
echo.
echo Check the separate windows for server logs.
echo Press any key to exit (servers will keep running)...
pause >nul

