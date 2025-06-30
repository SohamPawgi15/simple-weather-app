// Simple Weather App - Main JavaScript
// Author: Soham Pawgi
// This file handles all the app logic: fetching weather, AQI, alerts, theming, and UI updates.

class WeatherApp {
    constructor() {
        // Get API key from config (will be set by hosting platform)
        this.apiKey = window.config?.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
        this.baseUrl = window.config?.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org';
        // Backend proxy URL - update this with your deployed backend URL
        this.backendUrl = window.config?.BACKEND_URL || 'http://localhost:3000';
        // Default to Celsius; can be toggled
        this.unit = window.config?.DEFAULT_UNIT || 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
        // Load search history from localStorage
        this.searchHistoryArr = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
        
        this.initializeElements();
        this.bindEvents();
        this.updateHistoryDisplay();
        this.setupPWAInstall();
    }

    // Grab all the DOM elements we'll need
    initializeElements() {
        // Search and control elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.unitToggle = document.getElementById('unitToggle');
        this.unitText = document.getElementById('unitText');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.citySuggestions = document.getElementById('citySuggestions');

        // Weather display elements
        this.weatherContainer = document.getElementById('weatherContainer');
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.temperature = document.getElementById('temperature');
        this.temperatureUnit = document.getElementById('temperatureUnit');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.feelsLikeUnit = document.getElementById('feelsLikeUnit');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.windUnit = document.getElementById('windUnit');
        this.visibility = document.getElementById('visibility');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.forecastList = document.getElementById('forecastList');

        // AQI and alerts
        this.aqiContainer = document.getElementById('aqiContainer');
        this.aqiValue = document.getElementById('aqiValue');
        this.aqiDescription = document.getElementById('aqiDescription');
        this.alertsContainer = document.getElementById('alertsContainer');
        this.alertsList = document.getElementById('alertsList');

        // Error/loading/history
        this.errorContainer = document.getElementById('errorContainer');
        this.errorTitle = document.getElementById('errorTitle');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingContainer = document.getElementById('loadingContainer');
        this.historyContainer = document.getElementById('historyContainer');
        this.searchHistoryEl = document.getElementById('searchHistory');

        // Weather statistics elements
        this.weatherStats = document.getElementById('weatherStats');
        this.sunrise = document.getElementById('sunrise');
        this.sunset = document.getElementById('sunset');
        this.tempHigh = document.getElementById('tempHigh');
        this.tempLow = document.getElementById('tempLow');
        this.uvIndex = document.getElementById('uvIndex');
        this.pressure = document.getElementById('pressure');
    }

    // Set up all event listeners
    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('input', (e) => this.handleCityInput(e));
        this.cityInput.addEventListener('keydown', (e) => this.handleSuggestionKeydown(e));
        this.cityInput.addEventListener('focus', () => this.showSuggestions());
        document.addEventListener('click', (e) => {
            if (!this.cityInput.contains(e.target) && !this.citySuggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.unitToggle.addEventListener('click', () => this.toggleUnit());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        // Load last searched city on page load
        window.addEventListener('load', () => {
            if (this.searchHistoryArr.length > 0) {
                this.searchWeatherByCity(this.searchHistoryArr[0]);
            }
        });
    }

    // Handle search button or Enter key
    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name', 'No City Entered');
            return;
        }
        await this.searchWeatherByCity(city);
    }

    // Main search logic: get coordinates, fetch weather, AQI, alerts, update UI
    async searchWeatherByCity(city) {
        this.showLoading();
        this.hideError();
        this.hideWeather();
        try {
            const { lat, lon, name, country } = await this.fetchCoordinates(city);
            const weatherData = await this.fetchOneCallData(lat, lon);
            this.displayWeather(weatherData, name, country);
            this.displayForecast(weatherData);
            await this.fetchAndDisplayAQI(lat, lon);
            this.displayAlerts(weatherData);
            this.addToHistory(city);
            this.cityInput.value = city;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            this.showError(
                error.message || 'Failed to fetch weather data. Please try again.',
                'Weather Data Error'
            );
        } finally {
            this.hideLoading();
        }
    }

    // Use backend proxy for geocoding instead of calling OpenWeather directly
    async fetchCoordinates(city) {
        const url = `${this.backendUrl}/api/geocode/${encodeURIComponent(city)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch coordinates.');
        const data = await response.json();
        if (!data.length) throw new Error('City not found. Please check the spelling and try again.');
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            country: data[0].country
        };
    }

    // Fetch weather and forecast from backend proxy
    async fetchOneCallData(lat, lon) {
        const url = `${this.backendUrl}/api/weather?lat=${lat}&lon=${lon}&units=${this.unit}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data. Please try again later.');
        return await response.json();
    }

    // Update the main weather display
    displayWeather(data, cityName, country) {
        this.cityName.textContent = `${cityName}, ${country}`;
        this.currentDate.textContent = this.formatDate(new Date());
        this.temperature.textContent = Math.round(data.current.temp);
        this.temperatureUnit.textContent = this.unit === 'metric' ? '°C' : '°F';
        this.feelsLike.textContent = Math.round(data.current.feels_like);
        this.feelsLikeUnit.textContent = this.unit === 'metric' ? '°C' : '°F';
        this.humidity.textContent = data.current.humidity;
        this.windSpeed.textContent = Math.round(data.current.wind_speed);
        this.windUnit.textContent = this.unit === 'metric' ? 'm/s' : 'mph';
        this.visibility.textContent = data.current.visibility ? (data.current.visibility / 1000).toFixed(1) : '--';
        const weather = data.current.weather[0];
        this.weatherDescription.textContent = weather.description;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        this.weatherIcon.alt = weather.description;
        
        // Apply weather-based theme
        this.applyWeatherTheme(weather.main, weather.description);
        
        // Display weather statistics
        this.displayWeatherStats(data);
        
        this.showWeather();
    }

    // Apply weather-based theme colors
    applyWeatherTheme(weatherMain, description) {
        const body = document.body;
        const container = document.querySelector('.container');
        
        // Remove existing weather themes
        body.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-stormy');
        
        // Apply new theme based on weather
        if (weatherMain === 'Clear' || description.includes('clear')) {
            body.classList.add('weather-sunny');
        } else if (weatherMain === 'Clouds' || description.includes('cloud')) {
            body.classList.add('weather-cloudy');
        } else if (weatherMain === 'Rain' || description.includes('rain') || description.includes('drizzle')) {
            body.classList.add('weather-rainy');
        } else if (weatherMain === 'Snow' || description.includes('snow')) {
            body.classList.add('weather-snowy');
        } else if (weatherMain === 'Thunderstorm' || description.includes('thunder')) {
            body.classList.add('weather-stormy');
        }
    }

    // Show 5-day forecast (skip today)
    displayForecast(data) {
        this.forecastList.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const forecast = data.daily[i];
            if (!forecast) continue;
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            const date = new Date(forecast.dt * 1000);
            const dayName = this.getDayName(date);
            const weather = forecast.weather[0];
            forecastItem.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png" 
                     alt="${weather.description}" class="forecast-icon">
                <div class="forecast-temp">
                    <span class="temp-high">${Math.round(forecast.temp.max)}${this.unit === 'metric' ? '°C' : '°F'}</span>
                    <span class="temp-separator">/</span>
                    <span class="temp-low">${Math.round(forecast.temp.min)}${this.unit === 'metric' ? '°C' : '°F'}</span>
                </div>
                <div class="forecast-description">${weather.description}</div>
            `;
            this.forecastList.appendChild(forecastItem);
        }
    }

    // Utility: get day name for forecast
    getDayName(date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Format date for display
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Use browser geolocation to get weather for current location
    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser.', 'Location Error');
            return;
        }
        this.showLoading();
        this.hideError();
        this.hideWeather();
        try {
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            const geoData = await this.reverseGeocode(latitude, longitude);
            const weatherData = await this.fetchOneCallData(latitude, longitude);
            this.displayWeather(weatherData, geoData.name, geoData.country);
            this.displayForecast(weatherData);
            await this.fetchAndDisplayAQI(latitude, longitude);
            this.displayAlerts(weatherData);
            this.addToHistory(geoData.name);
            this.cityInput.value = geoData.name;
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showError(
                'Unable to get your location. Please check your location permissions.',
                'Location Error'
            );
        } finally {
            this.hideLoading();
        }
    }

    // Helper for geolocation
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: true
            });
        });
    }

    // Reverse geocode lat/lon to city name/country using backend proxy
    async reverseGeocode(lat, lon) {
        const url = `${this.backendUrl}/api/reverse-geocode?lat=${lat}&lon=${lon}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to reverse geocode location.');
        const data = await response.json();
        if (!data.length) throw new Error('Location not found.');
        return {
            name: data[0].name,
            country: data[0].country
        };
    }

    // Toggle between Celsius and Fahrenheit
    toggleUnit() {
        this.unit = this.unit === 'metric' ? 'imperial' : 'metric';
        this.unitText.textContent = this.unit === 'metric' ? '°C' : '°F';
        // Refresh current weather display if there's data
        if (!this.weatherContainer.classList.contains('hidden')) {
            const currentCity = this.cityName.textContent.split(',')[0];
            this.searchWeatherByCity(currentCity);
        }
    }

    // Save city to search history (max 10)
    addToHistory(city) {
        this.searchHistoryArr = this.searchHistoryArr.filter(item => item !== city);
        this.searchHistoryArr.unshift(city);
        this.searchHistoryArr = this.searchHistoryArr.slice(0, 10);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(this.searchHistoryArr));
        this.updateHistoryDisplay();
    }

    // Update the search history UI
    updateHistoryDisplay() {
        this.searchHistoryEl.innerHTML = '';
        this.searchHistoryArr.forEach(city => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = city;
            historyItem.addEventListener('click', () => {
                this.searchWeatherByCity(city);
            });
            this.searchHistoryEl.appendChild(historyItem);
        });
    }

    // Show/hide UI helpers
    showWeather() {
        this.weatherContainer.classList.remove('hidden');
    }
    hideWeather() {
        this.weatherContainer.classList.add('hidden');
    }
    showLoading() {
        this.loadingContainer.classList.remove('hidden');
        // Add weather-themed loading message
        const loadingText = this.loadingContainer.querySelector('p');
        const messages = [
            'Checking the skies...',
            'Gathering weather data...',
            'Looking up the forecast...',
            'Getting the latest conditions...',
            'Fetching weather info...'
        ];
        loadingText.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
    hideLoading() {
        this.loadingContainer.classList.add('hidden');
    }
    showError(message, title = 'Error') {
        this.errorTitle.textContent = title;
        this.errorMessage.textContent = message;
        this.errorContainer.classList.remove('hidden');
    }
    hideError() {
        this.errorContainer.classList.add('hidden');
    }

    // Fetch AQI from backend proxy
    async fetchAndDisplayAQI(lat, lon) {
        try {
            const url = `${this.backendUrl}/api/air-quality?lat=${lat}&lon=${lon}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch AQI.');
            const data = await response.json();
            if (!data.list || !data.list.length) throw new Error('No AQI data available.');
            const aqi = data.list[0].main.aqi;
            this.aqiValue.textContent = aqi;
            this.aqiDescription.textContent = this.getAQIDescription(aqi);
            this.aqiContainer.classList.remove('hidden');
        } catch (e) {
            this.aqiValue.textContent = '--';
            this.aqiDescription.textContent = 'AQI unavailable';
            this.aqiContainer.classList.remove('hidden');
        }
    }

    // Translate AQI number to description
    getAQIDescription(aqi) {
        switch (aqi) {
            case 1: return 'Good';
            case 2: return 'Fair';
            case 3: return 'Moderate';
            case 4: return 'Poor';
            case 5: return 'Very Poor';
            default: return 'Unknown';
        }
    }

    // Show weather alerts if present
    displayAlerts(data) {
        if (data.alerts && data.alerts.length > 0) {
            this.alertsList.innerHTML = '';
            data.alerts.forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.className = 'alert-item';
                alertItem.innerHTML = `<strong>${alert.event}</strong><br>${alert.description}`;
                this.alertsList.appendChild(alertItem);
            });
            this.alertsContainer.classList.remove('hidden');
        } else {
            this.alertsList.innerHTML = '';
            this.alertsContainer.classList.add('hidden');
        }
    }

    // Toggle between dark and light themes
    toggleTheme() {
        const body = document.body;
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
        }
    }

    // PWA Install Prompt
    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            
            // Show install prompt after a delay
            setTimeout(() => {
                this.showInstallPrompt();
            }, 3000);
        });
    }

    showInstallPrompt() {
        // Check if user has already dismissed the prompt
        if (localStorage.getItem('installPromptDismissed')) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
            <div>
                <strong>Install Weather App</strong>
                <div style="font-size: 0.9rem; margin-top: 5px;">Get quick access to weather info</div>
            </div>
            <button onclick="window.weatherApp.installApp()">Install</button>
            <button class="close-btn" onclick="window.weatherApp.dismissInstallPrompt()">×</button>
        `;
        
        document.body.appendChild(prompt);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.remove();
            }
        }, 10000);
    }

    async installApp() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            window.deferredPrompt = null;
        }
        this.dismissInstallPrompt();
    }

    dismissInstallPrompt() {
        const prompt = document.querySelector('.install-prompt');
        if (prompt) {
            prompt.remove();
        }
        localStorage.setItem('installPromptDismissed', 'true');
    }

    // Display weather statistics
    displayWeatherStats(data) {
        // Sunrise and sunset
        const timezone = data.timezone || 'UTC';
        const sunriseTime = new Date(data.current.sunrise * 1000);
        const sunsetTime = new Date(data.current.sunset * 1000);
        this.sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone
        });
        this.sunset.textContent = sunsetTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone
        });

        // High and low temperatures (from today's forecast)
        if (data.daily && data.daily[0]) {
            this.tempHigh.textContent = `${Math.round(data.daily[0].temp.max)}${this.unit === 'metric' ? '°C' : '°F'}`;
            this.tempLow.textContent = `${Math.round(data.daily[0].temp.min)}${this.unit === 'metric' ? '°C' : '°F'}`;
        }

        // UV Index
        this.uvIndex.textContent = data.current.uvi ? data.current.uvi.toFixed(1) : '--';

        // Pressure
        this.pressure.textContent = data.current.pressure ? `${data.current.pressure} hPa` : '--';

        // Show the stats section
        this.weatherStats.classList.remove('hidden');
    }

    // Autocomplete logic
    handleCityInput(e) {
        const value = e.target.value.trim();
        if (!value) {
            this.hideSuggestions();
            return;
        }
        clearTimeout(this.suggestionTimeout);
        this.suggestionTimeout = setTimeout(() => {
            this.fetchCitySuggestions(value);
        }, 250);
    }

    async fetchCitySuggestions(query) {
        try {
            const url = `${this.backendUrl}/api/geocode/${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch suggestions');
            const data = await response.json();
            if (!data.length) {
                this.hideSuggestions();
                return;
            }
            this.showSuggestions(data);
        } catch (e) {
            this.hideSuggestions();
        }
    }

    showSuggestions(suggestions = []) {
        if (!suggestions.length) {
            this.citySuggestions.classList.add('hidden');
            this.citySuggestions.innerHTML = '';
            return;
        }
        this.citySuggestions.innerHTML = '';
        suggestions.slice(0, 7).forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'city-suggestion';
            div.textContent = `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`;
            div.tabIndex = 0;
            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.selectSuggestion(item);
            });
            this.citySuggestions.appendChild(div);
        });
        this.citySuggestions.classList.remove('hidden');
        this.suggestionIndex = -1;
    }

    hideSuggestions() {
        this.citySuggestions.classList.add('hidden');
        this.citySuggestions.innerHTML = '';
        this.suggestionIndex = -1;
    }

    handleSuggestionKeydown(e) {
        const items = Array.from(this.citySuggestions.querySelectorAll('.city-suggestion'));
        if (!items.length || this.citySuggestions.classList.contains('hidden')) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.suggestionIndex = (this.suggestionIndex + 1) % items.length;
            this.updateSuggestionHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.suggestionIndex = (this.suggestionIndex - 1 + items.length) % items.length;
            this.updateSuggestionHighlight(items);
        } else if (e.key === 'Enter' && this.suggestionIndex >= 0) {
            e.preventDefault();
            items[this.suggestionIndex].dispatchEvent(new Event('mousedown'));
        }
    }

    updateSuggestionHighlight(items) {
        items.forEach((el, idx) => {
            el.classList.toggle('active', idx === this.suggestionIndex);
        });
        if (this.suggestionIndex >= 0) {
            items[this.suggestionIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    selectSuggestion(item) {
        this.cityInput.value = `${item.name}${item.state ? ', ' + item.state : ''}, ${item.country}`;
        this.hideSuggestions();
        this.searchWeather();
    }
}

// Start the app when the DOM is ready
// (I like to keep this at the bottom for clarity)
document.addEventListener('DOMContentLoaded', () => {
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    const weatherApp = new WeatherApp();
    window.weatherApp = weatherApp; // For debugging in console
}); 