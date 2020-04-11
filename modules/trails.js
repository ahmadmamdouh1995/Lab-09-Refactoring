'use stric';

require('dotenv').config();
const superagent = require('superagent');
const helper = require('./helper.js');

function trialhand(request, response) {
    superagent(`https://www.hikingproject.com/data/get-trails?lat=${request.query.latitude}&lon=${request.query.longitude}&maxDistance=1000&key=${process.env.TRAILS_API_KEY}`)
        .then((trailData) => {
            console.log(trailData);
            const trailSum = trailData.body.trails.map((trail) => {
                return new Trails(trail);
            });
            response.status(200).json(trailSum);
        })
        .catch((error) => helper.errorHandler(error, request, response));
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
module.exports = trialhand;