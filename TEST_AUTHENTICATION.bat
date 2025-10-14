@echo off
title Lighter Pooa - Authentication Test
color 0B

echo.
echo ========================================
echo   LIGHTER POOA - AUTHENTICATION TEST
echo ========================================
echo.
echo This will test the authentication system
echo and create test users in the database.
echo.
echo Make sure the server is running first!
echo.
pause

echo.
echo Running authentication tests...
echo.

node test-auth-system.js

echo.
echo ========================================
echo   TEST COMPLETE
echo ========================================
echo.
echo You can now test login/signup in browser:
echo http://localhost:5000
echo.
pause