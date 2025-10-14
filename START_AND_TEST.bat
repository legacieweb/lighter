@echo off
echo ========================================
echo   LIGHTER POOA - Starting Server
echo ========================================
echo.

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install

echo.
echo ========================================
echo   Starting Server...
echo ========================================
echo.
echo Server will start on http://localhost:5000
echo.
echo To test authentication:
echo 1. Open http://localhost:5000 in your browser
echo 2. Click "Sign Up" to create an account
echo 3. Or click "Login" to sign in
echo.
echo Admin credentials:
echo Email: iyonicpay@gmail.com
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start