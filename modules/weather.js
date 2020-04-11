'use stric';

require('dotenv').config();
const superagent = require('superagent');
const helper = require('./helper.js');

function weatherHand(request, response) {
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`)
        .then((weatherData) => {
            console.log(weatherData);
            const weatherSum = weatherData.body.data.map((day) => {
                return new Weather(day);
            });
            response.status(200).json(weatherSum);
        })
        .catch((error) => helper.errorHandler(error, request, response));
}

function Weather(day) {
    this.forecast = day.weather.description;
    this.time = new Date(day.valid_date).toDateString();
}

module.exports = weatherHand;
