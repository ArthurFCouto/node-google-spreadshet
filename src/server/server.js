const { createServer } = require('http');
const handlerRoutes = require('./routes');

module.exports = createServer(handlerRoutes);
