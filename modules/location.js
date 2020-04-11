'use stric';

require('dotenv').config();
const client = require('./client');
const superagent = require('superagent');
const helper = require('./helper.js');

function locationHand(request, response) {
    const city = request.query.city;

    const SQL = 'SELECT * FROM locations2 WHERE search_query = $1 ';
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
                        const SQL = `INSERT INTO locations2 (search_query , formatted_query ,latitude,longitude) VALUES($1,$2,$3,$4) RETURNING *`;
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
        .catch((error) => helper.errorHandler(error, request, response));
};


function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

module.exports = locationHand;