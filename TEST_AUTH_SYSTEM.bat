@echo off
echo ========================================
echo   LIGHTER POOA - AUTH SYSTEM TEST
echo ========================================
echo.
echo Starting server and opening test pages...
echo.

REM Start the server in a new window
start "Lighter Pooa Server" cmd /k "node server.js"

REM Wait for server to start
timeout /t 3 /nobreak >nul

REM Open the main page
start http://localhost:5000

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Open login page in new tab
start http://localhost:5000/login.html

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Open signup page in new tab
start http://localhost:5000/signup.html

echo.
echo ========================================
echo   Pages opened in your browser:
echo   1. Home Page (http://localhost:5000)
echo   2. Login Page (http://localhost:5000/login.html)
echo   3. Signup Page (http://localhost:5000/signup.html)
echo ========================================
echo.
echo Server is running in a separate window.
echo Close that window to stop the server.
echo.
pause