/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
const {
  pathToRegexp, match,
} = require('path-to-regexp');

let request = {};
let response = {};

const handleParams = ()=> {
  const data = request.url.indexOf('?') !== -1 && request.url.slice(request.url.indexOf('?') + 1, request.url.length);
  if (data) {
    const list = data.split('&').map((item)=> {
      const [key, value] = item.split('=');
      return `"${key}" : "${value}"`;
    });
    return JSON.parse(`{${list.join(',')}}`);
  }
  return data;
};

const handleRegex = (url)=> {
  try {
    const regexp = pathToRegexp(url);
    const parameters = match(url);
    const src = request.url.indexOf('?') !== -1 ? request.url.slice(0, request.url.indexOf('?')) : request.url;
    request.path = JSON.parse(JSON.stringify(parameters(src).params));
    request.params = handleParams();
    return regexp.test(src);
  } catch {
    return false;
  }
};

function router(req, res) {
  request = req;
  response = res;
}

router.prototype.get = async (url, callback)=> {
  if (request.method === 'GET' && handleRegex(url)) {
    request._finished = true;
    return callback(request, response);
  }
  return this;
};

router.prototype.post = async (url, callback)=> {
  if (request.method === 'POST' && handleRegex(url)) {
    request._finished = true;
    return callback(request, response);
  }
  return this;
};

router.prototype.delete = async (url, callback)=> {
  if (request.method === 'DELETE' && handleRegex(url)) {
    request._finished = true;
    return callback(request, response);
  }
  return this;
};

router.prototype.put = async (url, callback)=> {
  if (request.method === 'PUT' && handleRegex(url)) {
    request._finished = true;
    return callback(request, response);
  }
  return this;
};

/*
Será chamada somente se o response não foi enviado ao cliente
*/
router.prototype.use = (callback)=> {
  if (!request._finished) { callback(request, response); }
};

router.prototype.jsonContentType = ()=> {
  response.setHeader('Content-Type', 'application/json');
};

const useRouter = (req, res)=> new router(req, res);

module.exports = useRouter;
