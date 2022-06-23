/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
const { pathToRegexp, match } = require('path-to-regexp');

let request = {};
let response = {};

/*
  Função que irá converter os dados enviados no body da requisição via POST.
  O tempo foi definido apenas para fins de teste, ainda é preciso encontrar a melhor maneira de executar este método
*/
const handleBodyParser = (callback)=> {
  let res = [];
  request.on('data', (chunk)=> {
    res.push(chunk);
  }).on('end', ()=> {
    res = Buffer.concat(res).toString();
    request.rawBody = res;
    if (res && res.indexOf('{') > -1) {
      request.body = JSON.parse(res);
    }
  });
  return setTimeout(()=> callback(request, response), 1500);
};

/*
  Função que irá extrair os parâmetros da URL
*/
const handleParams = ()=> {
  const { url } = request;
  const indexOf = url.indexOf('?');
  const data = indexOf !== -1 && url.slice(indexOf + 1, url.length);
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
const handleRegex = (data)=> {
  try {
    const { url } = request;
    const indexOf = url.indexOf('?');
    const src = indexOf !== -1 ? url.slice(0, indexOf) : url;
    const regexp = pathToRegexp(data);
    const parameters = match(data);
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
    // return callback(request, response);
    return handleBodyParser(callback);
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

const useRouter = (req, res)=> new router(req, res);

module.exports = useRouter;
