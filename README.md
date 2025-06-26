# Simple Weather App

Hey there! This is a weather dashboard I built for fun and to learn more about web APIs, JavaScript, and responsive design. It fetches real-time weather, AQI, and alerts for any city using OpenWeatherMap. I hope you find it useful or inspiring!

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

### 1. Get Your Free API Key
- Go to [OpenWeatherMap](https://openweathermap.org/)
- Sign up and grab your API key from your dashboard.

### 2. Add Your API Key
- Open `script.js` in your code editor.
- Find the line with `this.apiKey = 'YOUR_API_KEY';` and paste your key in.

### 3. Run the App
- Just open `index.html` in your browser. That's it!
- (For public hosting, see the tips at the end.)

## Usage Tips

- **Search:** Enter a city and hit Enter or click the search icon.
- **Location:** Click the location arrow to use your device's location (allow permission).
- **Switch Units:** Click °C/°F to toggle temperature units.
- **Theme:** Click the moon/sun to switch between dark and light mode.
- **History:** Click any city in "Recent Searches" to reload its weather instantly.

## How It Works

- Uses OpenWeatherMap's One Call 3.0 API for weather and alerts, and the Air Pollution API for AQI.
- Uses the Geocoding API to convert city names to coordinates.
- All data is fetched with JavaScript (no backend needed).
- Search history is saved in your browser (localStorage).

## File Structure

```
Simple Weather App/
├── index.html      # Main HTML file
├── styles.css      # All the CSS for layout, theming, and responsive design
├── script.js       # JavaScript for fetching data and updating the UI
├── demo.html       # Demo version with mock data (no API key needed)
└── README.md       # This file
```

## Troubleshooting

- **City not found?** Double-check the spelling or try a bigger city nearby.
- **Location not working?** Make sure your browser has location permission.
- **API errors?** Check your API key, and make sure you haven't hit the free usage limit (1,000 calls/day).
- **Icons not loading?** Make sure you're online; icons are loaded from OpenWeatherMap's CDN.

## Hosting Your App

Want to share your app with friends? You can host it for free on [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/), or [Vercel](https://vercel.com/). Just upload your files and follow their instructions.

## Contributing

If you have ideas, spot a bug, or want to add a feature, feel free to fork this repo or open an issue! I built this to learn, so I'm happy to see others improve it.

## License

MIT. Use it, remix it, share it—just don't sell it as your own.

---

Thanks for checking out my project! If you use it or build on it, let me know—I'd love to see what you make.