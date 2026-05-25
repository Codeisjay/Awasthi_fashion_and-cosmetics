@echo off
REM MongoDB Local Setup Script for Windows
REM This script checks for MongoDB and installs dependencies

echo ====================================
echo MongoDB Local Setup for MERN App
echo ====================================
echo.

REM Check if MongoDB is installed
echo Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: MongoDB not found!
    echo.
    echo Please install MongoDB Community Edition:
    echo 1. Download from: https://www.mongodb.com/try/download/community
    echo 2. Run the installer
    echo 3. Choose "Complete" installation
    echo 4. Check "Install MongoDB as a Service"
    echo 5. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo [OK] MongoDB is installed

REM Check if MongoDB service is running
echo.
echo Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo.
    echo WARNING: MongoDB service not running!
    echo Starting MongoDB service...
    net start MongoDB
    timeout /t 2 /nobreak
) else (
    echo [OK] MongoDB service is running
)

REM Install Node dependencies
echo.
echo Installing Backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

echo.
echo Installing Frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed

REM Check Python
echo.
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python not found!
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
echo [OK] Python is installed

REM Install Python dependencies
echo.
echo Installing ML Service dependencies...
cd ml-service
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install ML dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] ML Service dependencies installed

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Open MongoDB Atlas at: https://www.mongodb.com/cloud/atlas
echo 2. Create database: ecommerce-analytics
echo 3. Open 3 terminal windows and run:
echo.
echo    Terminal 1: cd server ^&^& npm run dev
echo    Terminal 2: cd client ^&^ npm run dev
echo    Terminal 3: cd ml-service ^& venv\Scripts\activate ^& python app.py
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
pause
