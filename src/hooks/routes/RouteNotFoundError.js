class RouteNotFoundError extends Error {
  constructor(method, path) {
    super(`A rota ${method} ${path} não existe`);
  }
}
module.exports = RouteNotFoundError;
