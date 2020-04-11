'use stric';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const client = require('./modules/client.js');

const PORT = process.env.PORT || 4000;
const app = express();
const helper = require('./modules/helper.js');
app.use(cors());


client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`my server is up and running on port ${PORT}`))
    })
    .catch((err) => { throw new Error(`startUp Error ${err}`)});

app.get('/', (request, response) => { response.send('Home Page!');});

const locationHand = require('./modules/location.js');
const weatherHand = require('./modules/weather.js');
const trialhand = require('./modules/trails.js');
const moviehand = require('./modules/movies.js');
const foodHand = require('./modules/yelp.js');


app.get('/location', locationHand);
app.get('/weather', weatherHand);
app.get('/trails', trialhand);
app.get('/movies', moviehand);
app.get('/yelp', foodHand);
app.use('*', helper.notFoundHandler);
app.use(helper.errorHandler);

