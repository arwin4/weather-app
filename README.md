# Weather app

I made this weather app [as part of The Odin Project's JavaScript course](https://www.theodinproject.com/lessons/node-path-javascript-weather-app). It expands on the assignment in a number of ways. Most notably, it features forecast information, not just current weather info.

## Features

- [x] Uses [weatherapi.com](https://weatherapi.com/) for worldwide weather information
- [ ] Custom location lookup (nearest city)
  - [ ] App requests location
- [ ] Displays forecast for current day and the two following days
- [ ] Displays some astronomical data for the current day: sun times and total hours of daylight

## Flaws

- The astronomical display does not work properly for locations that are experiencing polar days or nights.

## Technology used

Webpack, HTML, JavaScript, CSS.

Dependencies: date-fns (awesome library for working with dates and times).

## Things I noticed and learned while developing this project

- Webpack is becoming a lot less frustrating to set up as I get more familiar with it. I've saved my initial setup for this project as a template repository.
- Using object literals rather than switch statements is just really sleek. (At getWeekdayName())
