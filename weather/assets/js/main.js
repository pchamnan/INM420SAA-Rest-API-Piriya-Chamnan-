// API Key for WeatherAPI connection
const API_KEY = '11e4f1bfacca4a8a847173820250602';

// Function to display notification messages
// type: 'normal' (default), 'loading', 'error'
function showMessage(message, type = 'normal') {
    document.getElementById('messageContainer').innerHTML = `
        <div class="message ${type}">${message}</div>
    `;
}

// Function to clear notification messages
function clearMessage() {
    document.getElementById('messageContainer').innerHTML = '';
}

// Main function to fetch weather data
async function getWeather() {
    const city = document.getElementById('citySelect').value;
    const forecastContainer = document.querySelector('.forecast-container');
    
    // Check if a city is selected
    if (!city) {
        showMessage('Please select a city');
        document.getElementById('weatherResult').innerHTML = '';
        document.getElementById('airQuality').innerHTML = '';
        document.getElementById('forecastCards').innerHTML = '';
        forecastContainer.style.display = 'none';
        return;
    }

    // URLs for current weather and forecast data
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`;

    try {
        // Show loading state
        showMessage('Loading weather data...', 'loading');
        document.getElementById('weatherResult').innerHTML = '';
        document.getElementById('airQuality').innerHTML = '';
        document.getElementById('forecastCards').innerHTML = '';

        // Fetch current weather and air quality data
        const currentResponse = await fetch(currentUrl);
        const currentData = await currentResponse.json();

        // Fetch forecast data
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Clear loading message when data is loaded
        clearMessage();

        // Update all sections on the webpage
        displayCurrentWeather(currentData);
        displayAirQuality(currentData);
        displayForecast(forecastData);

    } catch (error) {
        showMessage('Error fetching weather data. Please try again later.', 'error');
    }
}

// Function to display current weather information
function displayCurrentWeather(data) {
    document.getElementById('weatherResult').innerHTML = `
        <div class="current-weather">
            <h2>Weather in ${data.location.name}</h2>
            <img src="https:${data.current.condition.icon}" alt="Weather Icon" class="weather-icon">
            <h3>${data.current.temp_c}°C</h3>
            <div class="weather-details">
                <p>☁️ ${data.current.condition.text}</p>
                <p>💧 Humidity: ${data.current.humidity}%</p>
                <p>🌪️ Wind Speed: ${data.current.wind_kph} km/h</p>
            </div>
        </div>
    `;
}

// Function to display air quality information
function displayAirQuality(data) {
    // Get AQI (Air Quality Index) and set display parameters
    const aqi = data.current.air_quality["us-epa-index"];
    let aqiClass = 'aqi-moderate';
    let aqiText = 'Moderate';
    let aqiEmoji = '😐';

    // Set air quality level based on AQI value
    if (aqi <= 2) {
        aqiClass = 'aqi-good';
        aqiText = 'Good';
        aqiEmoji = '😊';
    } else if (aqi >= 4) {
        aqiClass = 'aqi-poor';
        aqiText = 'Poor';
        aqiEmoji = '😷';
    }

    // Display air quality information
    document.getElementById('airQuality').innerHTML = `
        <div class="aqi-container">
            <h3>Air Quality ${aqiEmoji}</h3>
            <div class="${aqiClass}">
                <h4>${aqiText}</h4>
                <p>PM2.5: ${data.current.air_quality.pm2_5.toFixed(1)} μg/m³</p>
                <p>PM10: ${data.current.air_quality.pm10.toFixed(1)} μg/m³</p>
            </div>
        </div>
    `;
}

// Function to display weather forecast
function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    const forecastCards = document.getElementById('forecastCards');
    
    // Show container when data is available
    forecastContainer.style.display = 'block';
    
    // Display Extended Forecast
    const forecastHTML = data.forecast.forecastday.slice(0, 6).map(day => {
        // Format the date
        const date = new Date(day.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create forecast card for each day
        return `
            <div class="forecast-card">
                <div class="forecast-date">${date}</div>
                <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                <div class="forecast-temp">
                    <span>${day.day.maxtemp_c}°C</span> / 
                    <span>${day.day.mintemp_c}°C</span>
                </div>
                <div class="forecast-condition">${day.day.condition.text}</div>
                <p>💧 ${day.day.avghumidity}%</p>
                <p>🌪️ ${day.day.maxwind_kph} km/h</p>
            </div>
        `;
    }).join('');

    forecastCards.innerHTML = forecastHTML;
}