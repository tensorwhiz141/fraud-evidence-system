@echo off
echo ========================================
echo   Setting Up Supabase Configuration
echo ========================================
echo.

cd /d "%~dp0Frontend"

echo Creating .env file with Supabase credentials...

(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=https://uhopxfehjwxmtbvvjhvj.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVob3B4ZmVoand4bXRidnZqaHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzA4ODYsImV4cCI6MjA3MzQ0Njg4Nn0.U1EnbftqM5O61_PsiYBZRF_0op6piiYuxUPCyNJShK8
echo.
echo # Backend API URL
echo REACT_APP_BACKEND_URL=http://localhost:5050
echo.
echo # For Create React App ^(alternative naming^)
echo REACT_APP_SUPABASE_URL=https://uhopxfehjwxmtbvvjhvj.supabase.co
echo REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVob3B4ZmVoand4bXRidnZqaHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzA4ODYsImV4cCI6MjA3MzQ0Njg4Nn0.U1EnbftqM5O61_PsiYBZRF_0op6piiYuxUPCyNJShK8
) > .env

echo ✅ .env file created successfully!
echo.
echo ========================================
echo   Supabase Configuration Complete!
echo ========================================
echo.
echo Supabase URL: https://uhopxfehjwxmtbvvjhvj.supabase.co
echo Backend URL: http://localhost:5050
echo.
echo Next steps:
echo   1. Restart frontend if it's running
echo   2. Run: start-fullstack.bat
echo   3. Login at http://localhost:3000
echo.
echo You can now use either:
echo   - Backend auth: admin@fraud.com / admin123
echo   - Supabase auth: Your Supabase credentials
echo.
pause

