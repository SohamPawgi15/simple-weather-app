# Simple Weather App

Hey there! This is a weather dashboard I built for fun and to learn more about web APIs, JavaScript, and responsive design. It fetches real-time weather, AQI, and alerts for any city using OpenWeatherMap. I hope you find it useful or inspiring!

## 🔒 Security Notice

**Important**: This app now includes secure API key management. The API key is no longer exposed in the frontend code. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

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

### Option 1: Quick Start (Backend Proxy)
1. **Clone the repo** and navigate to the project folder
2. **Install dependencies:** `npm install`
3. **Set your API key** as an environment variable:
   ```bash
   export OPENWEATHER_API_KEY="your_api_key_here"
   ```
4. **Start the server:** `npm start`
5. **Open** `http://localhost:3000` in your browser

### Option 2: Frontend Only (with secure hosting)
1. **Get your API key** from [OpenWeatherMap](https://openweathermap.org/)
2. **Choose a hosting platform** (Netlify/Vercel recommended)
3. **Set environment variables** with your API key
4. **Deploy** your app

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

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
├── index.html          # Main HTML file
├── demo.html           # Demo version with mock data
├── styles.css          # All the CSS for layout, theming, and responsive design
├── script.js           # JavaScript for fetching data and updating the UI
├── config.js           # Configuration file (API keys, settings)
├── server.js           # Backend proxy server (secures API key)
├── package.json        # Node.js dependencies
├── DEPLOYMENT.md       # Secure deployment guide
├── .gitignore          # Excludes sensitive files
└── README.md           # This file
```

## Troubleshooting

- **City not found?** Double-check the spelling or try a bigger city nearby.
- **Location not working?** Make sure your browser has location permission.
- **API errors?** Check your API key, and make sure you haven't hit the free usage limit (1,000 calls/day).
- **Icons not loading?** Make sure you're online; icons are loaded from OpenWeatherMap's CDN.

## Hosting Your App

Want to share your app with friends? You can host it for free on:
- **[Netlify](https://www.netlify.com/)** (recommended - supports environment variables)
- **[Vercel](https://vercel.com/)** (supports environment variables)
- **[Railway](https://railway.app/)** (for backend proxy)
- **[Render](https://render.com/)** (for backend proxy)

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

## Contributing

If you have ideas, spot a bug, or want to add a feature, feel free to fork this repo or open an issue! I built this to learn, so I'm happy to see others improve it.

## License

MIT. Use it, remix it, share it—just don't sell it as your own.

---

Thanks for checking out my project! If you use it or build on it, let me know—I'd love to see what you make.