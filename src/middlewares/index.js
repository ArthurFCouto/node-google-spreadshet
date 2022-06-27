const handleCors = require('./cors');
const handleRouteNotFound = require('./routeNotFound');
const handleContentTypeJson = require('./contentTypeJson');
const handleAuth = require('./authMiddleware');

module.exports = {
  handleAuth,
  handleContentTypeJson,
  handleCors,
  handleRouteNotFound,
};
