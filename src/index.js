import './style.css';

import getWeather from './weather';

let weather;

async function saveWeather(location) {
  weather = await getWeather(location);
  console.log(weather);
}

function renderTemp(unit = 'C') {
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
  // Current weather
  const currentDayDiv = document.querySelector('.current');
  const iconDisplay = currentDayDiv.querySelector('.current-weather-icon');
  // TODO: Bigger image? (124x124)
  iconDisplay.src = `https:${weather.currentWeather.icon}`;
  renderTemp();
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
  let currentUnit = 'C';
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
