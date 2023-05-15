import './style.css';

import { formatDuration } from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import parse from 'date-fns/parse';

async function getWeatherData(query = 'Arnhem') {
  // Get weather/astronomical data for three days (includes current day)
  const url = `https://api.weatherapi.com/v1/forecast.json?key=%20b80d13c73b394cdaa92140628231405&q=${query}&days=3&aqi=no&alerts=no`;
  const weatherDataJSON = await fetch(url, { mode: 'cors' });
  const fullWeatherData = await weatherDataJSON.json();

  function getDaylightDuration() {
    // Returns the current day's length, formatted as '8 hours and 25 minutes'
    const { sunrise } = fullWeatherData.forecast.forecastday[0].astro;
    const { sunset } = fullWeatherData.forecast.forecastday[0].astro;

    // Convert times ('05:48 AM') to Date in order to use differenceInMinutes
    const sunriseDate = parse(sunrise, 'hh:mm a', new Date());
    const sunsetDate = parse(sunset, 'hh:mm a', new Date());
    const daylightMinutes = differenceInMinutes(sunsetDate, sunriseDate);

    // Convert and format
    const hours = Math.floor(daylightMinutes / 60);
    const minutes = daylightMinutes % 60;
    return formatDuration({ hours, minutes }, { delimiter: ' and ' });
  }

  const currentWeather = {
    city: fullWeatherData.location.name,
    country: fullWeatherData.location.country,

    description: fullWeatherData.current.condition.text,
    tempC: fullWeatherData.current.temp_c,
    tempF: fullWeatherData.current.temp_f,

    dayForecast: fullWeatherData.forecast.forecastday[0].day.condition.text,
  };

  // TODO: objects for forecasts of current day + 1 and current day + 2

  const sunTimes = {
    // TODO: regional hour format
    sunrise: fullWeatherData.forecast.forecastday[0].astro.sunrise,
    sunset: fullWeatherData.forecast.forecastday[0].astro.sunset,

    daylightDuration: getDaylightDuration(),
  };

  console.log(currentWeather);
}

getWeatherData();
