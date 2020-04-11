'use stric';

function notFoundHandler(request, response) {
    response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
    response.status(500).send(error);
}

module.exports = {
    notFoundHandler : notFoundHandler,
    errorHandler : errorHandler 
}