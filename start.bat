@echo off
echo ==============================================
echo 3xploit Competition Platform - Startup Script
echo ==============================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed.

:: Check for MongoDB (Port 27017)
echo Checking if MongoDB is running on port 27017...
netstat -an | find "27017" >nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] MongoDB does not appear to be running on port 27017!
    echo If MongoDB is running on a different port or in a Docker container, you can ignore this.
    echo Otherwise, please start MongoDB before continuing.
    pause
) else (
    echo [OK] MongoDB is running.
)

:: Install dependencies
echo.
echo Installing NPM dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install NPM dependencies.
    pause
    exit /b 1
)
echo [OK] Dependencies installed.

:: Start the application
echo.
echo Starting 3xploit Competition Server...
echo The game will be available at http://localhost:8080
echo.
call npm start
pause
