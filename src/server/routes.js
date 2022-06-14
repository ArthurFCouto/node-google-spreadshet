const controller = require('../controller');
const produtosjsoncontroller = require('../controller/produtosjsoncontroller');
const varejocontroller = require('../controller/varejocontroller');
const { handleCors, handleRouteNotFound } = require('../middlewares');
const useRouter = require('../hooks/routes');

async function routes(request, response) {
  const routesCustom = useRouter(request, response);
  routesCustom.jsonContentType();
  routesCustom.use(handleCors);
  routesCustom.get('/api/v1/', controller.getLogo);
  routesCustom.get('/api/v1/produtosjson', produtosjsoncontroller.getData);
  routesCustom.get('/api/v1/produtosjson/:id', produtosjsoncontroller.getById);
  routesCustom.get('/api/v1/produtosjson/image/:name', produtosjsoncontroller.getImage);
  routesCustom.get('/api/v1/varejo', varejocontroller.getData);
  routesCustom.get('/api/v1/varejo/buscar', varejocontroller.getByDescription);
  /*
    \\d+ <= Definindo que serão aceitos apenas números para o path especificado
  */
  routesCustom.get('/api/v1/varejo/:id(\\d+)', varejocontroller.getById);
  routesCustom.delete('/api/v1/varejo/:id(\\d+)', varejocontroller.deleteProduct);
  routesCustom.use(handleRouteNotFound);
}

function handleError(error, response) {
  response.writeHead(500, {
    'Content-Type': 'application/json',
  });
  return response.end(JSON.stringify({
    error: 'Erro interno no servidor, tente mais tarde',
    details: {
      status: 500,
      statusText: 'Internal server error',
      data: error,
    },
  }));
}

async function handlerRoutes(request, response) {
  return routes(request, response).catch((error)=> handleError(error, response));
}

module.exports = handlerRoutes;
