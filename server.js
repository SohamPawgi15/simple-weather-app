const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

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
        const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=7&appid=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }
        
        res.json(data);
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ error: 'Failed to fetch coordinates' });
    }
});

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