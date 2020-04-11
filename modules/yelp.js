'use stric';

require('dotenv');
const superagent = require('superagent');
const helper = require('./helper');

function foodHand(request, response) {
    superagent(`https://api.yelp.com/v3/businesses/search?location=${request.query.search_query}`)
        .set({ "Authorization": `Bearer ${process.env.YELP_API_KEY}` })
        .then((foodData) => {
            const foodSum = foodData.body.businesses.map((food) => {
                return new Foods(food);
            });
            response.status(200).json(foodSum);
        })
        .catch((error) => helper.errorHandler(error, request, response));
}

function Foods(food) {
    this.name = food.name;
    this.image_url = food.image_url;
    this.price = food.price;
    this.rating = food.rating;
    this.url = food.url;
}

module.exports = foodHand;