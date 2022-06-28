/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-extend-native */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable new-cap */
const { pathToRegexp, match } = require('path-to-regexp');
const config = require('../../server/config');

const { versionUrl } = config;
let request = {};
let response = {};

/*
  Função que irá tratar os dados enviados no corpo da requisição e adicionar ao body
  ** Está sendo tratado somente dados do tipo JSON
*/
const handleBodyParser = ()=> new Promise((resolve, reject)=> {
  let raw = [];
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
        resolve({});
      } catch (error) {
        reject(error);
      }
    });
});

const handleParams = (indexOf)=> {
  const { url } = request;
  const raw = indexOf !== -1 && url.slice(indexOf + 1, url.length);
  if (raw) {
    const list = raw.split('&').map((item)=> {
      const [key, value] = item.split('=');
      return `"${key}" : "${value}"`;
    });
    const paramsJson = JSON.parse(`{${list.join(',')}}`);
    return paramsJson;
  }
  return raw;
};

/*
  Função que irá extrair os PATH da URL e adicionar os parâmetros a requisição
*/
const handleRegex = (address)=> {
  try {
    address = `${versionUrl}${address}`;
    const { url } = request;
    const indexOf = url.indexOf('?');
    const src = indexOf !== -1 ? url.slice(0, indexOf) : url;
    const regexp = pathToRegexp(address);
    const paths = match(address);
    const { params: path } = paths(src);
    request.path = path && JSON.parse(JSON.stringify(path));
    request.params = handleParams(indexOf);
    return regexp.test(src);
  } catch {
    return false;
  }
};

const handleMiddlewares = async (callback)=> {
  const latestPosition = callback.length - 1;
  const middlewares = callback.slice(0, latestPosition);
  for (const middleware of middlewares) {
    await middleware(request, response);
    if (response.finished === true) {
      break;
    }
  }
  if (response.finished === true) {
    return;
  }
  const controller = callback[callback.length - 1];
  return controller(request, response);
};

function router(req, res) {
  request = req;
  response = res;
}

router.prototype.get = (address, ...callback)=> {
  const { method } = request;
  const { finished } = response;
  if (method === 'GET' && !finished) {
    const isMatch = handleRegex(address);
    if (!isMatch) {
      return this;
    }
    return handleMiddlewares(callback);
  }
  return this;
};

router.prototype.post = async (address, ...callback)=> {
  const { method } = request;
  const { finished } = response;
  if (method === 'POST' && !finished) {
    const isMatch = handleRegex(address);
    if (!isMatch) {
      return this;
    }
    await handleBodyParser().catch((error)=> error);
    return handleMiddlewares(callback);
  }
  return this;
};

router.prototype.delete = async (address, ...callback)=> {
  const { method } = request;
  const { finished } = response;
  if (method === 'DELETE' && !finished) {
    const isMatch = handleRegex(address);
    if (!isMatch) {
      return this;
    }
    await handleBodyParser().catch((error)=> error);
    return handleMiddlewares(callback);
  }
  return this;
};

router.prototype.put = async (address, ...callback)=> {
  const { method } = request;
  const { finished } = response;
  if (method === 'PUT' && !finished) {
    const isMatch = handleRegex(address);
    if (!isMatch) {
      return this;
    }
    await handleBodyParser().catch((error)=> error);
    return handleMiddlewares(callback);
  }
  return this;
};

router.prototype.patch = async (address, ...callback)=> {
  const { method } = request;
  const { finished } = response;
  if (method === 'PATCH' && !finished) {
    const isMatch = handleRegex(address);
    if (!isMatch) {
      return this;
    }
    await handleBodyParser().catch((error)=> error);
    return handleMiddlewares(callback);
  }
  return this;
};

/*
  Será chamada somente se o response.end() não tiver sido chamado
*/
router.prototype.use = (callback)=> {
  const { finished } = response;
  if (!finished) {
    callback(request, response);
  }
};

const useRouter = (req, res)=> new router(req, res);

module.exports = useRouter;
