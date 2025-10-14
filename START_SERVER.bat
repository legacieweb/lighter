@echo off
echo ========================================
echo   LIGHTER POOA - Starting Server
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js is installed
echo.

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)
echo OK - Dependencies ready
echo.

echo [3/3] Starting server...
echo.
echo ========================================
echo   Server will start on port 5000
echo   Open: http://localhost:5000
echo ========================================
echo.

node server.js

pause