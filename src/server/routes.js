const controller = require('../controller');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const priceController = require('../controller/priceController');
const marketController = require('../controller/marketController');
const {
  handleAuth, handleContentTypeJson, handleCors, handleRouteNotFound,
} = require('../middlewares');
<<<<<<< HEAD
const Router = require('../hooks/routes');
const RouteNotFoundError = require('../hooks/routes/RouteNotFoundError');
const { modelResponseError } = require('../util/modelsResponse');
=======
const useRouter = require('../hooks/routes');
const customError = require('../util/error');
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c

async function routes(request, response) {
  const customRoutes = useRouter(request, response);
  customRoutes.use(handleCors);
  customRoutes.use(handleContentTypeJson);
  /*
    \\d+ <= Definindo que serão aceitos apenas números para o path especificado
    Os métodos abaixo não requerem autenticação
  */
  await customRoutes.get('/', controller.getLogo);
  await customRoutes.get('/produto', productController.getAll);
  await customRoutes.get('/produto/:id(\\d+)', productController.getById);
  await customRoutes.get('/produto/buscar', productController.getByDescription);
  await customRoutes.post('/usuario', userController.save);
  await customRoutes.post('/login', userController.login);
  await customRoutes.get('/preco', priceController.getAll);
  await customRoutes.get('/preco/:id(\\d+)', priceController.getById);
  await customRoutes.get('/mercado', marketController.getAll);
  await customRoutes.get('/mercado/:cnpj(\\d+)', marketController.getById);
  /*
    Os métodos abaixo requerem autenticação
  */
  await customRoutes.post('/preco', handleAuth, priceController.save);
  await customRoutes.delete('/preco/:id(\\d+)', handleAuth, priceController.delete);
  /*
    Os métodos abaixo requerem autenticação e autorização
  */
  await customRoutes.get('/usuario', handleAuth, userController.getAll);
  await customRoutes.get('/usuario/detalhes', handleAuth, userController.getById);
  await customRoutes.delete('/usuario', handleAuth, userController.delete);
  await customRoutes.delete('/produto/:id(\\d+)', handleAuth, productController.delete);
  await customRoutes.post('/mercado', handleAuth, marketController.save);
  await customRoutes.delete('/mercado/:cnpj(\\d+)', handleAuth, marketController.delete);
  customRoutes.use(handleRouteNotFound);
}

function handleError(error, response) {
<<<<<<< HEAD
  if (error instanceof RouteNotFoundError) {
    return handleRouteNotFound(error, response);
  }
  const modelError = modelResponseError('Erro interno no servidor, tente mais tarde', error);
  response.writeHead(modelError.details.status || 500, {
=======
  response.writeHead(500, {
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c
    'Content-Type': 'application/json',
  });
  return response.end(JSON.stringify(modelError));
}

<<<<<<< HEAD
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
=======
async function handlerRoutes(request, response) {
  return routes(request, response).catch((error)=> handleError(error, response));
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c
}

module.exports = handlerRoutes;
