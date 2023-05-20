import './style.css';

import getWeather from './weather';

let weather;
let currentUnit = 'C';

async function saveWeather(location) {
  weather = await getWeather(location);
  console.log(weather);
}

function renderTemp(unit) {
  // Display several temps, in Celcius by default but can also take 'F'

  const todayTempElem = document.querySelector('.current .temp');
  const tomorrowMinTempElem = document.querySelector('.tomorrow .min-temp');
  const tomorrowMaxTempElem = document.querySelector('.tomorrow .max-temp');
  const dayAfterTomorrowMinTempElem = document.querySelector(
    '.day-after-tomorrow .min-temp',
  );
  const dayAfterTomorrowMaxTempElem = document.querySelector(
    '.day-after-tomorrow .max-temp',
  );

  todayTempElem.textContent = weather.currentWeather[`temp${unit}`];
  tomorrowMinTempElem.textContent = weather.day1[`minTemp${unit}`];
  tomorrowMaxTempElem.textContent = weather.day1[`maxTemp${unit}`];
  dayAfterTomorrowMinTempElem.textContent = weather.day2[`minTemp${unit}`];
  dayAfterTomorrowMaxTempElem.textContent = weather.day2[`maxTemp${unit}`];
}

async function renderWeather(location) {
  await saveWeather(location);

  // Location name
  const locationName = document.querySelector('.location-name');
  locationName.textContent = weather.currentWeather.city;

  // Current weather
  const todayIcon = document.querySelector('.current-weather-icon');
  // TODO: Bigger image? (124x124)
  todayIcon.src = `https:${weather.currentWeather.icon}`;

  const todayDescription = document.querySelector('.description');
  todayDescription.textContent = weather.currentWeather.description;

  const todayForecast = document.querySelector('.today-forecast');
  todayForecast.textContent = weather.currentWeather.dayForecast;

  // Forecast tomorrow
  const tomorrowIcon = document.querySelector('.tomorrow-icon');
  tomorrowIcon.src = `https:${weather.day1.icon}`;

  // Forecast day after tomorrow
  const weekday = document.querySelector('.day-after-tomorrow .day-name');
  weekday.textContent = weather.day2.weekday;

  const dayAfterTomorrowIcon = document.querySelector(
    '.day-after-tomorrow-icon',
  );
  dayAfterTomorrowIcon.src = `https:${weather.day2.icon}`;

  renderTemp(currentUnit); // Render all temps
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

function changeUnit() {
  const unitBtn = document.querySelector('.temp-unit');
  unitBtn.textContent = 'Change to °F';

  unitBtn.addEventListener('click', () => {
    if (currentUnit === 'C') {
      renderTemp('F');
      unitBtn.textContent = 'Change to °C';
      currentUnit = 'F';
    } else if (currentUnit === 'F') {
      renderTemp('C');
      unitBtn.textContent = 'Change to °F';
      currentUnit = 'C';
    }
  });
}

renderWeather('Longyearbyen');
newLocation();
changeUnit();
