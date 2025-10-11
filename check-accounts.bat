@echo off
echo ========================================
echo   Checking User Accounts
echo ========================================
echo.

cd /d "%~dp0Backend"

node scripts/check-users.js

pause

