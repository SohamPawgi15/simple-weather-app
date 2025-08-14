@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting Heroku deployment for Weather App...

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Heroku CLI is not installed. Please install it first:
    echo    https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if user is logged in to Heroku
heroku auth:whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Heroku first:
    heroku login
)

REM Get app name from user
set /p app_name="📝 Enter your Heroku app name (or press Enter to let Heroku generate one): "

REM Create Heroku app
if "%app_name%"=="" (
    echo 🔧 Creating Heroku app with auto-generated name...
    heroku create
) else (
    echo 🔧 Creating Heroku app: %app_name%
    heroku create %app_name%
)

REM Get the app URL
for /f "tokens=2 delims==" %%i in ('heroku info -s ^| findstr web_url') do set app_url=%%i
echo 🌐 Your app will be available at: %app_url%

REM Set environment variables
echo 🔑 Setting up environment variables...
set /p api_key="Please enter your OpenWeather API key: "

if "%api_key%"=="" (
    echo ❌ API key is required. Please run the script again with a valid API key.
    pause
    exit /b 1
)

heroku config:set OPENWEATHER_API_KEY=%api_key%

REM Deploy the app
echo 📦 Deploying to Heroku...
git add .
git commit -m "Deploy to Heroku"
git push heroku main

REM Check if deployment was successful
if errorlevel 0 (
    echo ✅ Deployment successful!
    echo 🌐 Opening your app...
    heroku open
    
    echo.
    echo 🎉 Your weather app is now live on Heroku!
    echo 📝 Don't forget to update your config.js with the new backend URL:
    echo    BACKEND_URL: '%app_url%'
    echo.
    echo 🔧 To view logs: heroku logs --tail
    echo 🔧 To restart: heroku restart
    echo 🔧 To scale: heroku ps:scale web=1
) else (
    echo ❌ Deployment failed. Check the logs with: heroku logs --tail
    pause
    exit /b 1
)

pause
