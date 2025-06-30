# Secure Deployment Guide

This guide shows you how to deploy your weather app securely without exposing your API key.

## 🔒 Security Issue
Your API key is currently exposed in the code. This guide will help you secure it.

## 🚀 Recommended Hosting Platforms

### Option 1: Netlify (Recommended)
1. **Sign up** at [netlify.com](https://netlify.com)
2. **Connect your GitHub repo**
3. **Set environment variables:**
   - Go to Site Settings → Environment Variables
   - Add: `OPENWEATHER_API_KEY` = your actual API key
4. **Deploy automatically** from your GitHub repo

### Option 2: Vercel
1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import your GitHub repo**
3. **Set environment variables:**
   - Go to Project Settings → Environment Variables
   - Add: `OPENWEATHER_API_KEY` = your actual API key
4. **Deploy automatically**

### Option 3: GitHub Pages (with proxy)
Since GitHub Pages doesn't support environment variables, you'll need a backend proxy:

#### Quick Solution: Use a free proxy service
1. Create a simple backend on [Railway](https://railway.app) or [Render](https://render.com)
2. The backend will hold your API key and proxy requests
3. Update your frontend to call your backend instead of OpenWeather directly

## 📝 Manual Setup (Local Development)

1. **Create a local config file:**
   ```bash
   cp config.js config.local.js
   ```

2. **Edit `config.local.js`:**
   ```javascript
   const config = {
       OPENWEATHER_API_KEY: 'your_actual_api_key_here',
       // ... other settings
   };
   ```

3. **Update your HTML to use local config:**
   ```html
   <script src="config.local.js"></script>
   ```

4. **Add to .gitignore:**
   ```
   config.local.js
   ```

## 🔧 Alternative: Backend Proxy (Most Secure)

Create a simple backend that holds your API key:

### Using Node.js/Express:
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/api/weather/:city', async (req, res) => {
    // Your API key is safe here
    const response = await fetch(`https://api.openweathermap.org/...&appid=${API_KEY}`);
    const data = await response.json();
    res.json(data);
});

app.listen(3000);
```

### Update your frontend:
```javascript
// Instead of calling OpenWeather directly
const response = await fetch(`/api/weather/${city}`);
```

## 🛡️ Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** in production
3. **Set up API key rotation** if possible
4. **Monitor API usage** for unusual activity
5. **Use HTTPS** in production

## 🚨 Immediate Actions

1. **Regenerate your OpenWeather API key** (since it's been exposed)
2. **Remove the old key** from your code
3. **Choose a hosting platform** from the options above
4. **Set up environment variables** with your new API key

## 📞 Need Help?

- **Netlify Support**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **OpenWeather API**: [openweathermap.org/api](https://openweathermap.org/api)

## PWA & GitHub Pages

If you want your PWA to work when hosted on GitHub Pages, set:
- "start_url": "/your-repo-name/" in manifest.json
- Use local icons (icon-192.png, icon-512.png) and reference them in manifest and index.html
- Update your service worker to cache and serve files from the subdirectory
- Uninstall the old PWA from your device before reinstalling after changes 