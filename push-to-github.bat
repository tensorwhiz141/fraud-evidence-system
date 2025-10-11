@echo off
echo ========================================
echo   Pushing to GitHub Repository
echo ========================================
echo.
echo Repository: https://github.com/yashikart/fraud-evidence-system.git
echo.

REM Navigate to project root
cd /d "%~dp0"

echo [Step 1/6] Checking git status...
git status >nul 2>&1
if errorlevel 1 (
    echo   Initializing git repository...
    git init
    echo   ✅ Git initialized
) else (
    echo   ✅ Git repository exists
)
echo.

echo [Step 2/6] Configuring remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo   Adding remote origin...
    git remote add origin https://github.com/yashikart/fraud-evidence-system.git
    echo   ✅ Remote added
) else (
    echo   Remote already configured
    git remote set-url origin https://github.com/yashikart/fraud-evidence-system.git
    echo   ✅ Remote updated
)
echo.

echo [Step 3/6] Adding all files...
git add .
echo   ✅ All files staged
echo.

echo [Step 4/6] Creating commit...
git commit -m "Complete system: BHIV + Blockchain + RBAC + Login - All features integrated"
if errorlevel 1 (
    echo   ⚠️  Nothing to commit or commit failed
    echo   This might mean everything is already committed
) else (
    echo   ✅ Commit created
)
echo.

echo [Step 5/6] Fetching from remote...
git fetch origin master >nul 2>&1
if errorlevel 1 (
    echo   ⚠️  Could not fetch (might be first push)
) else (
    echo   ✅ Fetched from remote
)
echo.

echo [Step 6/6] Pushing to GitHub...
echo   This may take a few minutes for the first push...
echo.

git push -u origin master
if errorlevel 1 (
    echo.
    echo   ⚠️  Push failed. This might be because:
    echo   1. Remote has different history
    echo   2. Need to force push
    echo.
    echo   Do you want to force push? This will overwrite remote.
    echo   Press Ctrl+C to cancel, or
    pause
    echo.
    echo   Force pushing...
    git push -u origin master --force
    if errorlevel 1 (
        echo   ❌ Force push also failed
        echo   Please check your GitHub credentials
    ) else (
        echo   ✅ Force push successful
    )
) else (
    echo   ✅ Push successful
)

echo.
echo ========================================
echo   GitHub Push Complete!
echo ========================================
echo.
echo Repository: https://github.com/yashikart/fraud-evidence-system
echo.
echo Next steps:
echo   1. Visit your GitHub repository
echo   2. Verify all files are there
echo   3. Check the README.md
echo.
pause

