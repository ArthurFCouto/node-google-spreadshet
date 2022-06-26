const controller = require('../controller');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const priceController = require('../controller/priceController');
const marketController = require('../controller/marketController');
const { handleContentTypeJson, handleCors, handleRouteNotFound } = require('../middlewares');
const useRouter = require('../hooks/routes');
const customError = require('../util/error');
const config = require('./config');

async function routes(request, response) {
  const { versionUrl } = config;
  const routesCustom = useRouter(request, response);
  routesCustom.use(handleCors);
  routesCustom.use(handleContentTypeJson);
  await routesCustom.get(`${versionUrl}/`, controller.getLogo);
  await routesCustom.get(`${versionUrl}/produto`, productController.getAll);
  await routesCustom.get(`${versionUrl}/produto/buscar`, productController.getByDescription);
  /*
    \\d+ <= Definindo que serão aceitos apenas números para o path especificado
  */
  await routesCustom.get(`${versionUrl}/produto/:id(\\d+)`, productController.getById);
  await routesCustom.post(`${versionUrl}/usuario`, userController.save);
  await routesCustom.get(`${versionUrl}/preco`, priceController.getAll);
  await routesCustom.get(`${versionUrl}/preco/:id(\\d+)`, priceController.getById);
  await routesCustom.get(`${versionUrl}/mercado`, marketController.getAll);
  await routesCustom.get(`${versionUrl}/mercado/:cnpj(\\d+)`, marketController.getById);
  /*
    Implementar autenticação para os métodos abaixo
  */
  await routesCustom.post(`${versionUrl}/preco`, priceController.save);
  await routesCustom.delete(`${versionUrl}/preco/:id(\\d+)`, priceController.delete);
  /*
    Implementar autorização para os métodos abaixo
  */
  await routesCustom.get(`${versionUrl}/usuario`, userController.getAll);
  await routesCustom.get(`${versionUrl}/usuario/detalhes`, userController.getById);
  await routesCustom.delete(`${versionUrl}/usuario/detalhes`, userController.delete);
  await routesCustom.delete(`${versionUrl}/produto/:id(\\d+)`, productController.delete);
  await routesCustom.post(`${versionUrl}/mercado`, marketController.save);
  await routesCustom.delete(`${versionUrl}/mercado/:cnpj(\\d+)`, marketController.delete);
  await routesCustom.use(handleRouteNotFound);
}

function handleError(error, response) {
  response.writeHead(500, {
    'Content-Type': 'application/json',
  });
  return response.end(JSON.stringify({
    error: 'Erro interno no servidor, tente mais tarde',
    details: {
      ...customError[500],
      data: error.message,
    },
  }));
}

async function handlerRoutes(request, response) {
  return routes(request, response).catch((error)=> handleError(error, response));
}

module.exports = handlerRoutes;
