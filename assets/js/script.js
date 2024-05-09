const userInputEl = document.getElementById("citySearch");
const cityInputEl = document.getElementById("cityInput");
const cityHistoryEl = document.getElementById("cityHistory");
const mainWeatherEl = document.getElementById("mainWeather");
const weekForecastEl = document.getElementById("weekForecast");
const APIKey = "86c9e3ec4b462dab7922426420878e29";

// Function to retrieve searched cities from localStorage
function getSearchedCities() {
    const cities = localStorage.getItem('searchedCities');
    return cities ? JSON.parse(cities) : [];
}

// Function to save searched city to localStorage
function saveSearchedCity(city) {
    let searchedCities = getSearchedCities();
    // Checks if the city is not already in the search history
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
        // Updates the search history
        renderSearchHistory();
    }
}

// Function to render search history
function renderSearchHistory() {
    cityHistoryEl.innerHTML = "";
    const searchedCities = getSearchedCities();
    searchedCities.forEach(city => {
        const cityBtn = document.createElement("button");
        cityBtn.textContent = city;
        cityBtn.classList.add("city-btn");
        cityBtn.addEventListener("click", () => {
            getWeatherData(city);
        });
        cityHistoryEl.appendChild(cityBtn);
    });
}

// Function to get weather data for a city
function getWeatherData(city) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;
    // Makes a fetch request to get weather data
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        // Handles the weather data 
        renderWeather(data);
        getForecast(city);
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

// Function to render current weather data
function renderWeather(data) {
    mainWeatherEl.innerHTML = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Function to get forecast data for a city
function getForecast(city) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        renderForecast(data);
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
    });
}

// Function to render forecast data
function renderForecast(data) {
    weekForecastEl.innerHTML = "";
    const forecastList = data.list.filter((item, index) => index % 8 === 0); // Get forecast for every 24 hours (8 forecasts per day)
    forecastList.forEach(item => {
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
            <p>Temperature: ${item.main.temp} °C</p>
            <p>Humidity: ${item.main.humidity}%</p>
            <p>Wind Speed: ${item.wind.speed} m/s</p>
        `;
        weekForecastEl.appendChild(forecastItem);
    });
}

// Event listener for form submission
userInputEl.addEventListener("submit", function(event){
    event.preventDefault();
    const cityName = cityInputEl.value.trim();
    if (cityName) {
        saveSearchedCity(cityName);
        getWeatherData(cityName);
    } else {
        alert('Please enter a valid city name!');
    }
});

// Initial rendering of search history
renderSearchHistory();
