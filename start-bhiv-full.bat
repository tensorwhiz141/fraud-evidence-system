@echo off
REM Full BHIV System Startup Script for Windows
REM This script starts all BHIV services

echo ============================================
echo   Starting BHIV Full Stack
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

echo Starting services...
echo.

REM Start services in new windows
echo [1/4] Starting Node.js Backend...
start "Fraud Evidence Backend" cmd /k "cd Backend && npm start"
timeout /t 3 >nul

echo [2/4] Starting BHIV Core Events API...
start "BHIV Core Events API" cmd /k "cd Backend\core && python -m uvicorn events.core_events:app --host 0.0.0.0 --port 8004"
timeout /t 3 >nul

echo [3/4] Starting BHIV Webhooks API...
start "BHIV Webhooks API" cmd /k "cd Backend\core && python -m uvicorn events.webhooks:app --host 0.0.0.0 --port 8005"
timeout /t 3 >nul

echo [4/4] Starting BHIV MCP Bridge...
start "BHIV MCP Bridge" cmd /k "cd BHIV-Fouth-Installment-main\BHIV-Fouth-Installment-main && python mcp_bridge.py"
timeout /t 3 >nul

echo.
echo ============================================
echo   All services started!
echo ============================================
echo.
echo Services running:
echo   - Node.js Backend:        http://localhost:5050
echo   - BHIV Core Events API:   http://localhost:8004
echo   - BHIV Webhooks API:      http://localhost:8005
echo   - BHIV MCP Bridge:        http://localhost:8002
echo.
echo Check individual windows for service logs.
echo Press any key to exit this window (services will continue running)...
pause >nul

