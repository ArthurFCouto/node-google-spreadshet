const server = require('./server');
const config = require('./config');

const { port, versionUrl } = config;
server.listen(port, ()=> {
  console.log(`Server is running on port ${port}. Version URL: ${versionUrl}`);
});
