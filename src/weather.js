import { formatDuration } from 'date-fns';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';

function convertWeatherData(allWeather) {
  // Extract and convert the appropriate data from the API's response
  function getDaylightDuration() {
    // Returns the current day's length, formatted as '8 hours and 25 minutes'
    const { sunrise } = allWeather.forecast.forecastday[0].astro;
    const { sunset } = allWeather.forecast.forecastday[0].astro;

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
    city: allWeather.location.name,
    country: allWeather.location.country,

    icon: allWeather.current.condition.icon,
    description: allWeather.current.condition.text,
    tempC: allWeather.current.temp_c,
    tempF: allWeather.current.temp_f,

    dayForecast: allWeather.forecast.forecastday[0].day.condition.text,
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
    const fullDayData = allWeather.forecast.forecastday[dayNumber].day;
    const forecast = {
      minTempC: fullDayData.mintemp_c,
      maxTempC: fullDayData.maxtemp_c,
      minTempF: fullDayData.mintemp_f,
      maxTempF: fullDayData.maxtemp_f,

      text: fullDayData.condition.text,
      icon: fullDayData.condition.icon,
    };

    // Save weekday name
    const dateString = allWeather.forecast.forecastday[dayNumber].date;
    forecast.weekday = getWeekdayName(dateString);

    return forecast;
  }

  const sunTimes = {
    // TODO: regional hour format
    sunrise: allWeather.forecast.forecastday[0].astro.sunrise,
    sunset: allWeather.forecast.forecastday[0].astro.sunset,

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

const getWeather = async (query = 'Arnhem') => {
  // Get weather/astronomical data for three days (includes current day)
  const url = `https://api.weatherapi.com/v1/forecast.json?key=%20b80d13c73b394cdaa92140628231405&q=${query}&days=3&aqi=no&alerts=no`;
  const weatherDataJSON = await fetch(url, { mode: 'cors' });

  let fullWeatherData;
  try {
    fullWeatherData = await weatherDataJSON.json();
    console.log('got json');
  } catch (error) {
    console.log('couldnt get weather from api', error);
  }

  return convertWeatherData(fullWeatherData);
};

export default getWeather;
