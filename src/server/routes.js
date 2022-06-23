const controller = require('../controller');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const priceController = require('../controller/priceController');
const marketController = require('../controller/marketController');
const { handleCors, handleRouteNotFound } = require('../middlewares');
const useRouter = require('../hooks/routes');
const customError = require('../util/error');
const config = require('./config');

async function routes(request, response) {
  const { versionUrl } = config;
  const routesCustom = useRouter(request, response);
  routesCustom.use(handleCors);
  routesCustom.jsonContentType();
  routesCustom.get(`${versionUrl}/`, controller.getLogo);
  routesCustom.get(`${versionUrl}/produto`, productController.getAll);
  routesCustom.get(`${versionUrl}/produto/buscar`, productController.getByDescription);
  /*
    \\d+ <= Definindo que serão aceitos apenas números para o path especificado
  */
  routesCustom.get(`${versionUrl}/produto/:id(\\d+)`, productController.getById);
  routesCustom.post(`${versionUrl}/usuario`, userController.save);
  routesCustom.post(`${versionUrl}/preco`, priceController.save);
  routesCustom.get(`${versionUrl}/preco`, priceController.getAll);
  routesCustom.get(`${versionUrl}/preco/:id(\\d+)`, priceController.getById);
  routesCustom.delete(`${versionUrl}/preco/:id(\\d+)`, priceController.delete);
  routesCustom.get(`${versionUrl}/usuario`, userController.getAll);
  routesCustom.get(`${versionUrl}/usuario/detalhes`, userController.getById);
  routesCustom.delete(`${versionUrl}/usuario/detalhes`, userController.delete);
  routesCustom.delete(`${versionUrl}/produto/:id(\\d+)`, productController.delete);
  routesCustom.post(`${versionUrl}/mercado`, marketController.save);
  routesCustom.get(`${versionUrl}/mercado`, marketController.getAll);
  routesCustom.get(`${versionUrl}/mercado/:cnpj(\\d+)`, marketController.getById);
  routesCustom.delete(`${versionUrl}/mercado/:cnpj(\\d+)`, marketController.delete);
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
