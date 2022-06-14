/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
const { pathToRegexp, match } = require('path-to-regexp');

let request = {};
let response = {};

/*
  Função que irá extrair os parâmetros da URL
*/
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

/*
  Função que irá extrair os path da URL e os parâmetros
*/
const handleRegex = (url)=> {
  try {
    const src = request.url.indexOf('?') !== -1 ? request.url.slice(0, request.url.indexOf('?')) : request.url;
    const regexp = pathToRegexp(url);
    const parameters = match(url);
    const { params } = parameters(src);
    request.path = params && JSON.parse(JSON.stringify(parameters(src).params));
    request.params = handleParams();
    return regexp.test(src);
  } catch (error) {
    console.error('Erro no handleRegex', error);
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

router.prototype.patch = async (url, callback)=> {
  if (request.method === 'PATCH' && handleRegex(url)) {
    request._finished = true;
    return callback(request, response);
  }
  return this;
};

/*
Será chamada somente se o response não foi enviado ao cliente
*/
router.prototype.use = (callback)=> {
  if (!request._finished) {
    callback(request, response);
  }
};

router.prototype.jsonContentType = ()=> {
  response.setHeader('Content-Type', 'application/json');
};

const useRouter = (req, res)=> new router(req, res);

module.exports = useRouter;
