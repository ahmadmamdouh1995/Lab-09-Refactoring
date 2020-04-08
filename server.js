'use stric';

require('dotenv').config();

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', (err) => {
    throw new Error(err);
});
client
    .connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`my server is up and running on port ${PORT}`)
        )
    })
    .catch((err) => {
        throw new Error(`startUp Error ${err}`)
    });


app.get('/', (request, response) => {
    response.send('Home Page!');
});
// app.get('/bad', (request, response) => {
//     throw new Error('oh nooo!');
// });

app.get('/location', locationHand);
app.get('/weather', weatherHand);
app.get('/trails', trialhand);
app.use('*', notFoundHandler);
app.use(errorHandler);



function locationHand(request, response) {
    const city = request.query.city;
    const SQL = 'SELECT * FROM locations WHERE search_query = $1 ';
    const saveCity = [city];
    client
        .query(SQL, saveCity)
        .then((result) => {
            if (result.rows.length > 0) {
                response.status(200).json(result.rows[0]);
                console.log('FROM DATABASE');
            } else {
                superagent(`https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`)
                    .then((res) => {
                        console.log('fromWebsite');
                        const geoData = res.body;
                        const locationData = new Location(city, geoData);
                        const SQL = `INSERT INTO locations (search_query , formatted_query ,latitude,longitude) VALUES($1,$2,$3,$4) RETURNING *`;
                        const saveData = [
                            locationData.search_query,
                            locationData.formatted_query,
                            locationData.latitude,
                            locationData.longitude
                        ];
                        client.query(SQL, saveData).then((result) => {
                            // console.log(result.rows);
                            response.status(200).json(result.rows[0]);
                        })
                    })
            }
        })
        .catch((error) => errorHandler(error, request, response));
};


function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function weatherHand(request, response) {
    superagent(`https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`)
        .then((weatherData) => {
            console.log(weatherData);


            const weatherSum = weatherData.body.data.map((day) => {
                return new Weather(day);
            });
            response.status(200).json(weatherSum);
        })
        .catch((error) => errorHandler(error, request, response));
}

function Weather(day) {
    // this.search_query = weather;
    this.forecast = day.weather.description;
    this.time = new Date(day.valid_date).toDateString();
}

function trialhand(request, response) {
      superagent(`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=1000&key=${process.env.TRAILS_API_KEY}`)
        .then((trailData) => {
            console.log(trailData);

            const trailSum = trailData.body.trails.map((trail) => {
                return new Trails(trail);
            });
            response.status(200).json(trailSum);
        })
        .catch((error) => errorHandler(error, request, response));
}

function Trails(trail) {
    this.name = trail.name;
    this.location = trail.location;
    this.length = trail.length;
    this.stars = trail.stars;
    this.star_votes = trail.starVotes;
    this.summary = trail.summary;
    this.trail_url = trail.url;
    this.condition_time = trail.conditionDate.slice(11);
    this.condition_date = trail.conditionDate.slice(0, 10);

}

function notFoundHandler(request, response) {
    response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
    response.status(500).send(error);
}

// app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));
