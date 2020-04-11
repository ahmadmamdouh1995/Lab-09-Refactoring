'use stric';

require('dotenv');
const superagent = require('superagent');
const helper = require('./helper');

function moviehand(request, response) {
    superagent(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${request.query.search_query}`)
        .then((movieData) => {
            const movieSum = movieData.body.results.map((movie) => {
                return new Movies(movie);
            });
            response.status(200).json(movieSum);
        })
        .catch((error) => helper.errorHandler(error, request, response));
}


function Movies(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.average_votes;
    this.total_votes = movie.total_votes;
    this.image_url = movie.image_url;
    this.popularity = movie.popularity;
    this.released_on = movie.released_on;
}

module.exports = moviehand;