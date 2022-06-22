const server = require('./server');
const config = require('./config');

const { port } = config;
server.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
});
