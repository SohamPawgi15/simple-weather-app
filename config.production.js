// Production Configuration
// Replace 'YOUR_BACKEND_URL' with your actual deployed backend URL
// Examples:
// - Railway: 'https://your-app-name.railway.app'
// - Render: 'https://your-app-name.onrender.com'

const config = {
    // API key is handled by the backend proxy
    OPENWEATHER_API_KEY: 'HANDLED_BY_BACKEND',
    
    // Base URL for OpenWeather API
    OPENWEATHER_BASE_URL: 'https://api.openweathermap.org',
    
    // UPDATE THIS: Your deployed backend URL
    BACKEND_URL: 'YOUR_BACKEND_URL_HERE',
    
    // Default settings
    DEFAULT_UNIT: 'metric',
    
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