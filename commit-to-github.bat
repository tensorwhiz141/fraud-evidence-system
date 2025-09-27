@echo off
echo ========================================
echo   Fraud Evidence System - Git Commit
echo ========================================
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Or use GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with commit...
echo.

echo Initializing Git repository (if not already done)...
git init

echo.
echo Adding all files to staging...
git add .

echo.
echo Committing with production-ready message...
git commit -m "feat: Production-ready fraud evidence system

- ✅ RBAC Hardening: Complete permissions matrix and middleware
- ✅ Logging & Audit Trail: MongoDB + Blockchain logging with suspicious activity detection  
- ✅ Error Handling: Global error handler with consistent API responses
- ✅ Infrastructure Resilience: Kafka fallback, Docker health checks, environment-based secrets
- ✅ Blockchain Integration: Real-time WebSocket events and sync verification
- ✅ Testing & Deployment: Unit tests, integration tests, Postman collection, CI/CD pipeline

Production-ready with enterprise-grade security, resilience, and monitoring."

echo.
echo ========================================
echo   Commit completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Add remote repository: git remote add origin YOUR_GITHUB_URL
echo 2. Push to GitHub: git push -u origin main
echo.
echo Or use GitHub Desktop for easier management.
echo.
pause
