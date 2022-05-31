const handleCors = require('./cors/corsMiddlewares');
const handleRouteNotFound = require('./routeNotFound/routeNotFoundMiddlewares');

module.exports = {
  handleCors,
  handleRouteNotFound,
};
