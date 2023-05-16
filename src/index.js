import './style.css';

import getWeather from './weather';

let weather;

async function saveWeather(location) {
  weather = await getWeather(location);
  console.log(weather);
}

function renderTemp(currentDiv, unit = 'C') {
  const tempDisplay = currentDiv.querySelector('.temp');
  if (unit === 'C') {
    tempDisplay.textContent = weather.currentWeather.tempC;
  } else {
    // Fahrenheit
    tempDisplay.textContent = weather.currentWeather.tempF;
  }
}

async function renderWeather(location) {
  await saveWeather(location);
  // Current weather
  const currentDayDiv = document.querySelector('.current');
  const iconDisplay = currentDayDiv.querySelector('.current-weather-icon');
  // TODO: Bigger image? (124x124)
  iconDisplay.src = `https:${weather.currentWeather.icon}`;
  renderTemp(currentDayDiv);
}

function newLocation() {
  // Repopulate page with custom location information
  const searchForm = document.querySelector('.search-form');
  const locationInput = document.querySelector('.search-bar');
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (locationInput.value.length < 1) return;
    renderWeather(locationInput.value);
    locationInput.value = '';
  });
}

renderWeather('Longyearbyen');
newLocation();
