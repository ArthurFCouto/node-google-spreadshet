class handlerRouterNotFoundError extends Error {
  constructor(method, path) {
    super(`A rota ${method} ${path} não existe`);
  }
}

module.exports = handlerRouterNotFoundError;
