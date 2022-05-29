const server = require('./server');
const config = require('./config');

const { port, host } = config;
server.listen(port, host, ()=> {
  console.log(`Server is running on http://${host}:${port}`);
});
