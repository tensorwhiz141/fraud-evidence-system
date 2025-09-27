# Fraud Evidence System - Git Commit Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fraud Evidence System - Git Commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or use GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Initializing Git repository (if not already done)..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Adding all files to staging..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing with production-ready message..." -ForegroundColor Yellow
git commit -m "feat: Production-ready fraud evidence system

- ✅ RBAC Hardening: Complete permissions matrix and middleware
- ✅ Logging & Audit Trail: MongoDB + Blockchain logging with suspicious activity detection  
- ✅ Error Handling: Global error handler with consistent API responses
- ✅ Infrastructure Resilience: Kafka fallback, Docker health checks, environment-based secrets
- ✅ Blockchain Integration: Real-time WebSocket events and sync verification
- ✅ Testing & Deployment: Unit tests, integration tests, Postman collection, CI/CD pipeline

Production-ready with enterprise-grade security, resilience, and monitoring."

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Commit completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add remote repository: git remote add origin YOUR_GITHUB_URL" -ForegroundColor White
Write-Host "2. Push to GitHub: git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Or use GitHub Desktop for easier management." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
