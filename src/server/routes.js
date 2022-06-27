const controller = require('../controller');
const productController = require('../controller/productController');
const userController = require('../controller/userController');
const priceController = require('../controller/priceController');
const marketController = require('../controller/marketController');
const {
  handleAuth, handleContentTypeJson, handleCors, handleRouteNotFound,
} = require('../middlewares');
const useRouter = require('../hooks/routes');
const customError = require('../util/error');

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
