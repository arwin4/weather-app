/* eslint-disable operator-linebreak */
// ⬆ To vastly improve readability at renderTemps()
import { doc } from 'prettier';
import './style.css';

import getWeather from './weather';

let weather;
let currentUnit = 'C';

async function saveWeather(location) {
  weather = await getWeather(location);
  console.log(weather);
}

function renderSunData() {
  function renderSun() {
    // Render the sun image on its path
    const sun = document.querySelector('.sun');
    const { daylightProgressPercentage } = weather.sunTimes;
    sun.style['background-position-x'] = `${daylightProgressPercentage}%`;
  }

  function renderMoon() {}
  // TODO: Implement night behavior

  function renderText() {
    const sunriseElem = document.querySelector('.sunrise');
    const sunsetElem = document.querySelector('.sunset');
    const daylightDurationElem = document.querySelector('.daylight-duration');

    sunriseElem.textContent = weather.sunTimes.sunrise;
    sunsetElem.textContent = weather.sunTimes.sunset;
    daylightDurationElem.textContent = `${weather.sunTimes.daylightDurationText} of daylight today`;
  }

  if (weather.sunTimes.isDay) {
    renderSun();
  } else {
    renderMoon();
  }

  renderText();
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

  const unitDisplay = ` °${unit}`;

  todayTempElem.textContent =
    weather.currentWeather[`temp${unit}`] + unitDisplay;
  tomorrowMinTempElem.textContent =
    weather.day1[`minTemp${unit}`] + unitDisplay;
  tomorrowMaxTempElem.textContent =
    weather.day1[`maxTemp${unit}`] + unitDisplay;
  dayAfterTomorrowMinTempElem.textContent =
    weather.day2[`minTemp${unit}`] + unitDisplay;
  dayAfterTomorrowMaxTempElem.textContent =
    weather.day2[`maxTemp${unit}`] + unitDisplay;
}

function showSpinner(display) {
  // TODO: use document.readyState
  const spinner = document.querySelector('.spinner');
  if (display) {
    spinner.classList.add('show-spinner');
  } else {
    spinner.classList.remove('show-spinner');
  }
}

async function renderWeather(location) {
  showSpinner(true);

  await saveWeather(location);

  // Location name
  const locationName = document.querySelector('.location-name');
  locationName.textContent = weather.currentWeather.city;

  // Current weather
  const todayIcon = document.querySelector('.current-weather-icon');
  // TODO: Bigger image? (124x124)
  todayIcon.src = weather.currentWeather.icon;

  const todayDescription = document.querySelector('.description');
  todayDescription.textContent = weather.currentWeather.description;

  const todayForecast = document.querySelector('.today-forecast');
  todayForecast.textContent = weather.currentWeather.dayForecast;

  // Forecast tomorrow
  const tomorrowIcon = document.querySelector('.tomorrow-icon');
  tomorrowIcon.src = weather.day1.icon;

  // Forecast day after tomorrow
  const weekday = document.querySelector('.day-after-tomorrow .day-name');
  weekday.textContent = weather.day2.weekday;

  const dayAfterTomorrowIcon = document.querySelector(
    '.day-after-tomorrow-icon',
  );
  dayAfterTomorrowIcon.src = weather.day2.icon;

  renderTemp(currentUnit); // Render all temps
  renderSunData();

  showSpinner(false);
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

renderWeather('Arnhem');
newLocation();
changeUnit();
