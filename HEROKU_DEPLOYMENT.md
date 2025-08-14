# Heroku Deployment Guide

This guide will help you deploy your weather app to Heroku while keeping all functionality intact.

## 🚀 Prerequisites

1. **Heroku Account**: Sign up at [heroku.com](https://heroku.com)
2. **Heroku CLI**: Install from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
3. **Git**: Make sure your project is in a Git repository

## 📋 Step-by-Step Deployment

### 1. Install Heroku CLI and Login
```bash
# Install Heroku CLI (if not already installed)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

### 2. Create Heroku App
```bash
# Navigate to your project directory
cd "path/to/your/weather-app"

# Create a new Heroku app
heroku create your-weather-app-name

# Or let Heroku generate a random name
heroku create
```

### 3. Set Environment Variables
```bash
# Set your OpenWeather API key
heroku config:set OPENWEATHER_API_KEY=your_actual_api_key_here

# Verify the environment variable is set
heroku config
```

### 4. Deploy to Heroku
```bash
# Add all files to git (if not already done)
git add .

# Commit your changes
git commit -m "Deploy to Heroku"

# Push to Heroku
git push heroku main

# If you're on the master branch, use:
git push heroku master
```

### 5. Open Your App
```bash
# Open your app in the browser
heroku open
```

## 🔧 Configuration Updates

### Update config.js
After deployment, update your `config.js` file with your new Heroku URL:

```javascript
const config = {
    // ... other settings ...
    
    // Update this with your Heroku app URL
    BACKEND_URL: 'https://your-app-name.herokuapp.com',
    
    // ... rest of config ...
};
```

### Update index.html (if needed)
Make sure your `index.html` references the correct config file and doesn't have any hardcoded URLs.

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Build Failed
```bash
# Check build logs
heroku logs --tail

# Common fixes:
# - Make sure package.json has correct Node.js version
# - Ensure all dependencies are in package.json
```

#### 2. App Crashes on Start
```bash
# Check runtime logs
heroku logs --tail

# Common causes:
# - Missing environment variables
# - Port configuration issues
# - Missing dependencies
```

#### 3. API Key Issues
```bash
# Verify API key is set
heroku config:get OPENWEATHER_API_KEY

# Re-set if needed
heroku config:set OPENWEATHER_API_KEY=your_new_api_key
```

#### 4. CORS Issues
If you encounter CORS issues, the server.js already includes CORS middleware, but you might need to update it for your specific domain.

## 🔄 Updating Your App

### Making Changes
```bash
# Make your changes locally
# Test locally first: npm start

# Commit changes
git add .
git commit -m "Update description"

# Deploy to Heroku
git push heroku main
```

### Scaling (if needed)
```bash
# Scale to multiple dynos (paid feature)
heroku ps:scale web=2

# Check current dyno status
heroku ps
```

## 💰 Cost Information

- **Free Tier**: Heroku no longer offers a free tier
- **Basic Dyno**: $7/month (minimum for new apps)
- **Standard Dyno**: $25/month (better performance)

## 🔒 Security Best Practices

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Regularly rotate your API keys**
4. **Monitor your app logs** for unusual activity

## 📊 Monitoring Your App

```bash
# View real-time logs
heroku logs --tail

# Check app status
heroku ps

# Monitor dyno usage
heroku ps:scale
```

## 🆘 Getting Help

- **Heroku Documentation**: [devcenter.heroku.com](https://devcenter.heroku.com)
- **Heroku Support**: [help.heroku.com](https://help.heroku.com)
- **OpenWeather API**: [openweathermap.org/api](https://openweathermap.org/api)

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads without errors
- [ ] Weather data displays correctly
- [ ] Search functionality works
- [ ] Location detection works
- [ ] PWA features work (if applicable)
- [ ] All API endpoints respond correctly
- [ ] Environment variables are set correctly

## 🎉 Success!

Your weather app is now deployed on Heroku with all functionality intact. The backend proxy ensures your API key remains secure while providing all the weather data your app needs.
