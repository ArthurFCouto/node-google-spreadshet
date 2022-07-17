const handleCors = require('./cors');
const handleRouteNotFound = require('./routeNotFound');
const handleContentTypeJson = require('./contentTypeJson');
const handleAuth = require('./authMiddleware');
const handleRoleAdmin = require('./roleAdmin');

module.exports = {
  handleAuth,
  handleContentTypeJson,
  handleCors,
  handleRoleAdmin,
  handleRouteNotFound,
};
