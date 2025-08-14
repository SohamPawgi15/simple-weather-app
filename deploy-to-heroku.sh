#!/bin/bash

# Heroku Deployment Script for Weather App
# This script automates the deployment process

echo "🚀 Starting Heroku deployment for Weather App..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Get app name from user
echo "📝 Enter your Heroku app name (or press Enter to let Heroku generate one):"
read app_name

# Create Heroku app
if [ -z "$app_name" ]; then
    echo "🔧 Creating Heroku app with auto-generated name..."
    heroku create
else
    echo "🔧 Creating Heroku app: $app_name"
    heroku create $app_name
fi

# Get the app URL
app_url=$(heroku info -s | grep web_url | cut -d= -f2)
echo "🌐 Your app will be available at: $app_url"

# Set environment variables
echo "🔑 Setting up environment variables..."
echo "Please enter your OpenWeather API key:"
read api_key

if [ -z "$api_key" ]; then
    echo "❌ API key is required. Please run the script again with a valid API key."
    exit 1
fi

heroku config:set OPENWEATHER_API_KEY=$api_key

# Deploy the app
echo "📦 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Opening your app..."
    heroku open
    
    echo ""
    echo "🎉 Your weather app is now live on Heroku!"
    echo "📝 Don't forget to update your config.js with the new backend URL:"
    echo "   BACKEND_URL: '$app_url'"
    echo ""
    echo "🔧 To view logs: heroku logs --tail"
    echo "🔧 To restart: heroku restart"
    echo "🔧 To scale: heroku ps:scale web=1"
else
    echo "❌ Deployment failed. Check the logs with: heroku logs --tail"
    exit 1
fi
