const customError = require('../../util/error');

function routeNotFound(error, response) {
  response.writeHead(404);
  return response.end(JSON.stringify({
    error: 'Rota inexistente',
    details: {
      ...customError[404],
      data: error.message,
    },
  }));
}

module.exports = routeNotFound;
