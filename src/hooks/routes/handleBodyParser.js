const handleBodyParser = (request)=> new Promise((resolve, reject)=> {
  let raw = [];
  request.rawBody = '';
  request.body = {};
  request.on('data', (chunk)=> {
    raw.push(chunk);
  })
    .on('end', ()=> {
      try {
        raw = Buffer.concat(raw).toString();
        request.rawBody = raw;
        if (raw && raw.indexOf('{') !== -1) {
          request.body = JSON.parse(raw);
        }
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
});

module.exports = handleBodyParser;
