const { createServer } = require('http');
const handler = require('./routes');

module.exports = createServer(handler);
