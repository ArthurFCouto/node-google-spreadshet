class RouteNotFoundError extends Error {
  constructor(method, path) {
    super(`Rota ${method} ${path} não existe`);
  }
}
module.exports = RouteNotFoundError;
