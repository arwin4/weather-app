# Weather app

I made this weather app [as part of The Odin Project's JavaScript course](https://www.theodinproject.com/lessons/node-path-javascript-weather-app). It expands on the assignment by featuring a forecast and by showing some basic astronomical data.

## Features

- [x] Uses [weatherapi.com](https://weatherapi.com/) for worldwide weather information
- [x] Custom location lookup (nearest city)
- [x] Displays forecast for current day and the two following days
- [x] Displays some astronomical data for the current day: sun times and total hours of daylight

## Flaws

- The astronomical display does not work properly for locations that are experiencing polar days or nights.

## Technology used

Webpack, HTML, JavaScript, CSS.

Dependencies: date-fns (awesome library for working with dates and times).

## Things I noticed and learned while developing this project

- Webpack is becoming a lot less frustrating to set up as I get more familiar with it. I've saved my initial setup for this project as a template repository.
- Using object literals rather than switch statements is just really sleek.
- Layout troubleshooting is getting a lot easier, although it's still easy to underestimate how much time it takes.
- This is my first project using async and error handling. Both feel a bit awkward to use right now, but I'm sure future projects will help to solidify the basics.
