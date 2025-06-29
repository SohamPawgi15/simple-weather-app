# GitHub Pages Setup Guide

This guide will help you deploy your weather app on GitHub Pages with a secure backend proxy.

## 🚀 Quick Setup (5 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your weather app repository**
5. **Set environment variable:**
   - Go to Variables tab
   - Add: `OPENWEATHER_API_KEY` = your actual API key
6. **Wait for deployment** (usually 1-2 minutes)
7. **Copy the deployment URL** (e.g., `https://your-app-name.railway.app`)

### Step 2: Update Frontend Configuration

1. **Copy `config.production.js` to `config.js`:**
   ```bash
   cp config.production.js config.js
   ```

2. **Edit `config.js` and update the backend URL:**
   ```javascript
   BACKEND_URL: 'https://your-app-name.railway.app', // Your Railway URL
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add config.js
   git commit -m "Update backend URL for production"
   git push
   ```

### Step 3: Enable GitHub Pages

1. **Go to your GitHub repository**
2. **Settings → Pages**
3. **Source: Deploy from a branch**
4. **Branch: main** (or your default branch)
5. **Folder: / (root)**
6. **Click Save**

Your app will be available at: `https://yourusername.github.io/your-repo-name`

## 🔧 Alternative: Render Backend

If Railway doesn't work, try Render:

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **New → Web Service**
4. **Connect your repository**
5. **Set environment variable:**
   - Key: `OPENWEATHER_API_KEY`
   - Value: your API key
6. **Deploy**

## 🧪 Testing

1. **Test locally first:**
   ```bash
   npm install
   export OPENWEATHER_API_KEY="your_api_key"
   npm start
   ```
   Open `http://localhost:3000`

2. **Test the deployed backend:**
   Visit `https://your-backend-url.railway.app/api/health`
   Should show: `{"status":"OK","message":"Weather API proxy is running"}`

3. **Test the full app:**
   Visit your GitHub Pages URL and search for a city

## 🚨 Troubleshooting

### Backend Issues:
- **"API Key not configured"**: Check your environment variable in Railway/Render
- **"Failed to fetch"**: Make sure your backend URL is correct in `config.js`
- **CORS errors**: The backend includes CORS headers, should work fine

### Frontend Issues:
- **"City not found"**: Check if your backend is running and accessible
- **"Failed to fetch weather"**: Verify the backend URL in your config

### GitHub Pages Issues:
- **Page not loading**: Check if GitHub Pages is enabled in repository settings
- **404 errors**: Make sure all files are in the root directory

## 🔒 Security Check

✅ **API key is secure**: Only exists on your backend server  
✅ **Frontend is clean**: No sensitive data in the code  
✅ **HTTPS enabled**: Both GitHub Pages and Railway use HTTPS  

## 📞 Need Help?

- **Railway Support**: [docs.railway.app](https://docs.railway.app)
- **Render Support**: [render.com/docs](https://render.com/docs)
- **GitHub Pages**: [pages.github.com](https://pages.github.com)

## 🎉 You're Done!

Your weather app is now:
- ✅ Hosted on GitHub Pages
- ✅ API key is secure
- ✅ Backend proxy handles all API calls
- ✅ Free to use and maintain 