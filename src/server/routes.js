const controller = require('../controller');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const priceController = require('../controller/priceController');
const marketController = require('../controller/marketController');
const { modelResponseError } = require('../util/modelsResponse');
const {
  handleAuth, handleContentTypeJson, handleCors, handleRouteNotFound,
} = require('../middlewares');
const Router = require('../hooks/routes');
const RouteNotFoundError = require('../hooks/routes/routeNotFoundError');

function handleError(error, response) {
  if (error instanceof RouteNotFoundError) {
    return handleRouteNotFound(error, response);
  }
  const modelError = modelResponseError('Erro interno no servidor, tente mais tarde', error);
  response.writeHead(modelError.details.status || 500, {
    'Content-Type': 'application/json',
  });
  return response.end(JSON.stringify(modelError));
}

function handlerRoutes(request, response) {
  const router = Router.create(request, response);
  router.use(handleCors);
  router.use(handleContentTypeJson);
  /*
   * \\d+ <= Definindo que serão aceitos apenas números para o path especificado
   * Os métodos abaixo não requerem autenticação
   */
  router.get('/', controller.getLogo);
  router.get('/produto', productController.getAll);
  router.get('/produto/:id(\\d+)', productController.getById);
  router.get('/produto/buscar', productController.getByDescription);
  router.post('/usuario', userController.save);
  router.post('/login', userController.login);
  router.get('/preco', priceController.getAll);
  router.get('/preco/:id(\\d+)', priceController.getById);
  router.get('/mercado', marketController.getAll);
  router.get('/mercado/:cnpj(\\d+)', marketController.getById);
  /*
   * Os métodos abaixo requerem autenticação
   */
  router.post('/preco', handleAuth, priceController.save);
  router.delete('/preco/:id(\\d+)', handleAuth, priceController.delete);
  /*
   * Os métodos abaixo requerem autenticação e autorização
   */
  router.get('/usuario', handleAuth, userController.getAll);
  router.get('/usuario/detalhes', handleAuth, userController.getById);
  router.delete('/usuario', handleAuth, userController.delete);
  router.delete('/produto/:id(\\d+)', handleAuth, productController.delete);
  router.post('/mercado', handleAuth, marketController.save);
  router.delete('/mercado/:cnpj(\\d+)', handleAuth, marketController.delete);
  /*
   * Processa a requisição atual
   */
  router.exec().catch((error)=> { handleError(error, response); });
}

module.exports = handlerRoutes;
