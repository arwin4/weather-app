import './style.css';

import getWeather from './weather';

async function printData() {
  const weather = await getWeather();
  console.log(weather);
}

printData();
