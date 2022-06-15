const controller = require('../controller');
const productController = require('../controller/productController');
const { handleCors, handleRouteNotFound } = require('../middlewares');
const useRouter = require('../hooks/routes');
const customError = require('../util/error');

async function routes(request, response) {
  const routesCustom = useRouter(request, response);
  routesCustom.jsonContentType();
  routesCustom.use(handleCors);
  routesCustom.get('/api/v1/', controller.getLogo);
  routesCustom.get('/api/v1/produto', productController.getData);
  routesCustom.get('/api/v1/produto/buscar', productController.getByDescription);
  /*
    \\d+ <= Definindo que serão aceitos apenas números para o path especificado
  */
  routesCustom.get('/api/v1/produto/:id(\\d+)', productController.getById);
  routesCustom.delete('/api/v1/produto/:id(\\d+)', productController.deleteProduct);
  routesCustom.use(handleRouteNotFound);
}

function handleError(error, response) {
  response.writeHead(500, {
    'Content-Type': 'application/json',
  });
  return response.end(JSON.stringify({
    error: 'Erro interno no servidor, tente mais tarde',
    details: {
      ...customError[500],
      data: error,
    },
  }));
}

async function handlerRoutes(request, response) {
  return routes(request, response).catch((error)=> handleError(error, response));
}

module.exports = handlerRoutes;
