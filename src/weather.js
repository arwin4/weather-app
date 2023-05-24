/* eslint-disable no-alert */
/* eslint-disable operator-linebreak */

import { formatDuration } from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';

function convertWeatherData(allWeather) {
  // Extract and convert the appropriate data from the API's response

  const currentWeather = {
    city: allWeather.location.name,
    country: allWeather.location.country,

    icon: allWeather.current.condition.icon,
    description: allWeather.current.condition.text,
    tempC: Math.round(allWeather.current.temp_c),
    tempF: Math.round(allWeather.current.temp_f),

    dayForecast: allWeather.forecast.forecastday[0].day.condition.text,
  };

  const sunTimes = {
    // TODO: regional hour format
    sunrise: allWeather.forecast.forecastday[0].astro.sunrise,
    sunset: allWeather.forecast.forecastday[0].astro.sunset,
    localTime: allWeather.location.localtime,
  };

  function calculateDaylightData() {
    const { sunrise } = sunTimes;
    const { sunset } = sunTimes;
    const { localTime } = sunTimes;

    // Calculate the total minutes of daylight
    // Convert times ('05:48 AM') to Date in order to use differenceInMinutes
    const sunriseDate = parse(sunrise, 'hh:mm a', new Date());
    const sunsetDate = parse(sunset, 'hh:mm a', new Date());
    const daylightMinutes = differenceInMinutes(sunsetDate, sunriseDate);
    sunTimes.daylightDurationMinutes = daylightMinutes;

    // Format the current day's length as '8 hours and 25 minutes'
    const hours = Math.floor(daylightMinutes / 60);
    const minutes = daylightMinutes % 60;
    sunTimes.daylightDurationText = formatDuration(
      { hours, minutes },
      { delimiter: ' and ' },
    );

    // Calculate daylight progress percentage
    // (At 50%, the sun is at the halfway point of its journey through the sky.)
    const localTimeDate = parse(localTime, 'yyyy-MM-dd HH:mm', new Date());

    const daylightMinutesPassed = differenceInMinutes(
      localTimeDate,
      sunriseDate,
    );

    const daylightProgressPercentage =
      (daylightMinutesPassed / daylightMinutes) * 100;
    sunTimes.daylightProgressPercentage = daylightProgressPercentage;

    if (daylightProgressPercentage > 0 && daylightProgressPercentage < 100) {
      sunTimes.isDay = true;
    } else {
      sunTimes.isDay = false;
    }
  }

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
    const fullDayData = allWeather.forecast.forecastday[dayNumber].day;
    const forecast = {
      minTempC: Math.round(fullDayData.mintemp_c),
      maxTempC: Math.round(fullDayData.maxtemp_c),
      minTempF: Math.round(fullDayData.mintemp_f),
      maxTempF: Math.round(fullDayData.maxtemp_f),

      text: fullDayData.condition.text,
      icon: fullDayData.condition.icon,
    };

    // Save weekday name
    const dateString = allWeather.forecast.forecastday[dayNumber].date;
    forecast.weekday = getWeekdayName(dateString);

    return forecast;
  }

  const day1 = getDailyForecast(1);
  const day2 = getDailyForecast(2);
  calculateDaylightData();

  return {
    currentWeather,
    sunTimes,
    day1,
    day2,
  };
}

async function getWeather(query = 'Arnhem') {
  // Get weather/astronomical data for three days (includes current day)
  const url = `https://api.weatherapi.com/v1/forecast.json?key=%20b80d13c73b394cdaa92140628231405&q=${query}&days=3&aqi=no&alerts=no`;

  const weatherDataJSON = await fetch(url, { mode: 'cors' });

  try {
    const fullWeatherData = await weatherDataJSON.json();
    if (fullWeatherData.error) {
      // eslint-disable-next-line no-console
      console.log(
        `Server responded with: ${fullWeatherData.error.code}: ${fullWeatherData.error.message}`,
      );
      throw new Error('Error');
    } else {
      return convertWeatherData(fullWeatherData);
    }
  } catch (error) {
    alert(
      'Could not look up the weather for this location. Please make sure to enter a valid name.',
    );
    // Reload page
    window.open(window.document.URL, '_self');
    return null;
  }
}

export default getWeather;
