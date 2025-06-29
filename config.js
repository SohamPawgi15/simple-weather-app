// Configuration file for API keys and settings
// This file should be added to .gitignore in production

const config = {
    // API key will be injected by the hosting platform or set manually
    OPENWEATHER_API_KEY: 'YOUR_API_KEY_HERE',
    
    // Base URL for OpenWeather API
    OPENWEATHER_BASE_URL: 'https://api.openweathermap.org',
    
    // Backend proxy URL - UPDATE THIS with your deployed backend URL
    // Examples:
    // - Railway: 'https://your-app-name.railway.app'
    // - Render: 'https://your-app-name.onrender.com'
    // - Local development: 'http://localhost:3000'
    BACKEND_URL: 'https://simple-weather-app.up.railway.app',
    
    // Default settings
    DEFAULT_UNIT: 'metric', // 'metric' for Celsius, 'imperial' for Fahrenheit
    
    // API endpoints
    ENDPOINTS: {
        GEOCODING: '/geo/1.0/direct',
        REVERSE_GEOCODING: '/geo/1.0/reverse',
        ONE_CALL: '/data/3.0/onecall',
        AIR_POLLUTION: '/data/2.5/air_pollution'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
} 