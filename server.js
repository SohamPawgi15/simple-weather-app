const express = require('express');
const cors = require('cors');
const path = require('path');

// Use built-in fetch for Node.js 18+ or fallback to node-fetch
let fetch;
if (typeof globalThis.fetch === 'undefined') {
    fetch = require('node-fetch');
} else {
    fetch = globalThis.fetch;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Get API key from environment variable
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

// Proxy endpoint for geocoding
app.get('/api/geocode/:city', async (req, res) => {
    try {
        const { city } = req.params;
        
        // First, try with a higher limit to get more results
        const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=15&appid=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }
        
        // Sort results to prioritize major cities
        const sortedData = data.sort((a, b) => {
            // Prioritize cities with higher population (if available) or better name matches
            const aScore = getCityScore(a, city);
            const bScore = getCityScore(b, city);
            return bScore - aScore;
        });
        
        // Return top 7 results
        res.json(sortedData.slice(0, 7));
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Failed to fetch coordinates' });
    }
});

// Helper function to score cities for better prioritization
function getCityScore(city, searchTerm) {
    let score = 0;
    const searchLower = searchTerm.toLowerCase();
    const cityName = city.name.toLowerCase();
    const stateName = (city.state || '').toLowerCase();
    const countryName = (city.country || '').toLowerCase();
    
    // Exact name match gets highest score
    if (cityName === searchLower) {
        score += 1000;
    }
    
    // Starts with search term
    if (cityName.startsWith(searchLower)) {
        score += 500;
    }
    
    // Contains search term
    if (cityName.includes(searchLower)) {
        score += 200;
    }
    
    // Major cities (common names that should be prioritized)
    const majorCities = [
        'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata',
        'new york', 'london', 'paris', 'tokyo', 'beijing', 'shanghai',
        'moscow', 'berlin', 'madrid', 'rome', 'amsterdam', 'vienna',
        'sydney', 'melbourne', 'toronto', 'vancouver', 'montreal',
        'chicago', 'los angeles', 'san francisco', 'boston', 'washington'
    ];
    
    if (majorCities.includes(cityName)) {
        score += 300;
    }
    
    // Capital cities get bonus
    const capitalCities = [
        'new delhi', 'london', 'paris', 'tokyo', 'beijing', 'moscow',
        'berlin', 'madrid', 'rome', 'amsterdam', 'vienna', 'canberra',
        'ottawa', 'washington', 'brasilia', 'buenos aires', 'mexico city'
    ];
    
    if (capitalCities.includes(cityName)) {
        score += 200;
    }
    
    // Prefer cities with state/province info
    if (city.state) {
        score += 50;
    }
    
    return score;
}

// Proxy endpoint for reverse geocoding
app.get('/api/reverse-geocode', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to reverse geocode');
        }
        
        res.json(data);
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        res.status(500).json({ error: 'Failed to reverse geocode' });
    }
});

// Proxy endpoint for weather data
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon, units = 'metric' } = req.query;
        const url = `${BASE_URL}/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        res.json(data);
    } catch (error) {
        console.error('Weather error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Proxy endpoint for air quality
app.get('/api/air-quality', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const url = `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to fetch air quality data');
        }
        
        res.json(data);
    } catch (error) {
        console.error('Air quality error:', error);
        res.status(500).json({ error: 'Failed to fetch air quality data' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Weather API proxy is running' });
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Weather API proxy running on port ${PORT}`);
    console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
}); 