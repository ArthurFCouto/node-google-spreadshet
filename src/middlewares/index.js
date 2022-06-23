const handleCors = require('./cors');
const handleRouteNotFound = require('./routeNotFound');
const handleContentTypeJson = require('./contentTypeJson');

module.exports = {
  handleContentTypeJson,
  handleCors,
  handleRouteNotFound,
};
