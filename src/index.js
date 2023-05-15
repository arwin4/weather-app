import './style.css';

import { formatDuration } from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';

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

    icon: fullWeatherData.current.condition.icon,
    description: fullWeatherData.current.condition.text,
    tempC: fullWeatherData.current.temp_c,
    tempF: fullWeatherData.current.temp_f,

    dayForecast: fullWeatherData.forecast.forecastday[0].day.condition.text,
  };

  function getWeekdayName(dateString) {
    // Get a date's weekday name in English.
    // dateString must be formatted as '2023-05-15', which returns 'Monday'.

    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    const dayNumber = getDay(date);

    return {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday',
    }[dayNumber];
  }

  function getDailyForecast(dayNumber) {
    const fullDayData = fullWeatherData.forecast.forecastday[dayNumber].day;
    const forecast = {
      minTempC: fullDayData.mintemp_c,
      maxTempC: fullDayData.maxtemp_c,
      minTempF: fullDayData.mintemp_f,
      maxTempF: fullDayData.maxtemp_f,

      text: fullDayData.condition.text,
      icon: fullDayData.condition.icon,
    };

    // Save weekday name
    const dateString = fullWeatherData.forecast.forecastday[dayNumber].date;
    forecast.weekday = getWeekdayName(dateString);

    return forecast;
  }

  const sunTimes = {
    // TODO: regional hour format
    sunrise: fullWeatherData.forecast.forecastday[0].astro.sunrise,
    sunset: fullWeatherData.forecast.forecastday[0].astro.sunset,

    daylightDuration: getDaylightDuration(),
  };

  const forecastDay1 = getDailyForecast(1);
  const forecastDay2 = getDailyForecast(2);

  return {
    currentWeather,
    sunTimes,
    forecastDay1,
    forecastDay2,
  };
}

(async () => {
  console.log((await getWeatherData()).currentWeather);
  console.log((await getWeatherData()).sunTimes);
  console.log((await getWeatherData()).forecastDay1);
  console.log((await getWeatherData()).forecastDay2);
})();
