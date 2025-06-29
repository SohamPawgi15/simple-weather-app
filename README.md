# Simple Weather App

Hey there! This is a weather dashboard I built for fun and to learn more about web APIs, JavaScript, and responsive design. It fetches real-time weather, AQI, and alerts for any city using OpenWeatherMap. I hope you find it useful or inspiring!

## 🔒 Security Notice

**Important**: This app now includes secure API key management. The API key is no longer exposed in the frontend code. All API calls are proxied through a secure backend to protect your API key.

## Features

- **City Search:** Type any city and get the current weather, AQI, and a 5-day forecast.
- **Current Weather:** See temperature, humidity, wind, weather description, and an icon.
- **Air Quality Index (AQI):** Shows the latest AQI and a simple description.
- **Weather Alerts:** If there are any alerts for your area, you'll see them right away.
- **Unit Toggle:** Switch between Celsius and Fahrenheit.
- **Geolocation:** Click the location button to get weather for where you are.
- **Dark/Light Theme:** Use the moon/sun button to toggle between dark and light mode.
- **Recent Searches:** Your last 10 searches are saved for quick access.
- **Responsive Design:** Works great on desktop, tablet, and mobile.

## Getting Started

### Option 1: GitHub Pages + Backend Proxy (Recommended)
1. **Deploy backend to Railway/Render** (see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md))
2. **Update `config.js`** with your backend URL
3. **Push to GitHub** and enable GitHub Pages
4. **Your app will be live** at `https://yourusername.github.io/your-repo-name`

### Option 2: Local Development
1. **Clone the repo** and navigate to the project folder
2. **Install dependencies:** `npm install`
3. **Set your API key** as an environment variable:
   ```bash
   export OPENWEATHER_API_KEY="your_api_key_here"
   ```
4. **Start the server:** `npm start`
5. **Open** `http://localhost:3000` in your browser

### Option 3: Other Hosting Platforms
- **Netlify/Vercel** with environment variables (see [DEPLOYMENT.md](DEPLOYMENT.md))
- **Railway/Render** for full-stack deployment

## Usage Tips

- **Search:** Enter a city and hit Enter or click the search icon.
- **Location:** Click the location arrow to use your device's location (allow permission).
- **Switch Units:** Click °C/°F to toggle temperature units.
- **Theme:** Click the moon/sun to switch between dark and light mode.
- **History:** Click any city in "Recent Searches" to reload its weather instantly.

## How It Works

- Uses OpenWeatherMap's One Call 3.0 API for weather and alerts, and the Air Pollution API for AQI.
- Uses the Geocoding API to convert city names to coordinates.
- **Secure:** API calls are proxied through a backend to protect your API key.
- Search history is saved in your browser (localStorage).

## File Structure

```
Simple Weather App/
├── index.html              # Main HTML file
├── demo.html               # Demo version with mock data
├── styles.css              # All the CSS for layout, theming, and responsive design
├── script.js               # JavaScript for fetching data and updating the UI
├── config.js               # Configuration file (API keys, settings)
├── config.production.js    # Production configuration template
├── server.js               # Backend proxy server (secures API key)
├── package.json            # Node.js dependencies
├── .gitignore              # Excludes sensitive files
├── DEPLOYMENT.md           # Secure deployment guide
├── GITHUB_PAGES_SETUP.md   # GitHub Pages specific setup
└── README.md               # This file
```

## Security Features

✅ **API Key Protection**: Backend proxy keeps your API key secure  
✅ **Environment Variables**: No hardcoded secrets in production  
✅ **HTTPS Only**: All deployments use secure connections  
✅ **CORS Configured**: Backend allows frontend requests safely  

## Troubleshooting

- **City not found?** Double-check the spelling or try a bigger city nearby.
- **Location not working?** Make sure your browser has location permission.
- **API errors?** Check your backend deployment and API key configuration.
- **Icons not loading?** Make sure you're online; icons are loaded from OpenWeatherMap's CDN.
- **Backend issues?** Check the health endpoint: `https://your-backend-url/api/health`

## Hosting Your App

Want to share your app with friends? You can host it for free on:
- **[GitHub Pages](https://pages.github.com/)** + Railway/Render backend (current setup)
- **[Netlify](https://www.netlify.com/)** (supports environment variables)
- **[Vercel](https://vercel.com/)** (supports environment variables)
- **[Railway](https://railway.app/)** (full-stack deployment)
- **[Render](https://render.com/)** (full-stack deployment)

See [DEPLOYMENT.md](DEPLOYMENT.md) and [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for step-by-step instructions.

## Contributing

If you have ideas, spot a bug, or want to add a feature, feel free to fork this repo or open an issue! I built this to learn, so I'm happy to see others improve it.

## License

MIT. Use it, remix it, share it—just don't sell it as your own.

---

Thanks for checking out my project! If you use it or build on it, let me know—I'd love to see what you make.