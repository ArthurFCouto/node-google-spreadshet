const RouteNotFoundError = require('./RouteNotFoundError');
const handleRegex = require('./handleRegex');
const handleBodyParser = require('./handleBodyParser');
const handleMiddlewares = require('./handleMiddlewares');

class Router {
  constructor(req, res) {
    this.request = req;
    this.response = res;
    this.routes = [];
    this.method = undefined;
    this.path = undefined;
  }

  static create(req, res) {
    return new this(req, res);
  }

  get(path, ...callbacks) {
    this.routes.push({
      method: 'GET',
      path,
      callbacks,
    });
  }

  post(path, ...callbacks) {
    this.routes.push({
      method: 'POST',
      path,
      callbacks,
    });
  }

  delete(path, ...callbacks) {
    this.routes.push({
      method: 'DELETE',
      path,
      callbacks,
    });
  }

  put(path, ...callbacks) {
    this.routes.push({
      method: 'PUT',
      path,
      callbacks,
    });
  }

  patch(path, ...callbacks) {
    this.routes.push({
      method: 'PATCH',
      path,
      callbacks,
    });
  }

  /*
    Será executado somente se o response.end() não tiver sido chamado
  */
  use(callback) {
    const { completed } = this.response;
    if (!completed) {
      callback(this.request, this.response);
    }
  }

  async exec() {
    const { method } = this.request;
    const { completed } = this.response;
    const matchedRoute = this.routes.find((route)=> {
      const isMatch = handleRegex(this.request, route.path);
      return isMatch ? route : undefined;
    });
    if (!matchedRoute || (method !== matchedRoute.method)) {
      throw new RouteNotFoundError(method, this.request.url);
    }
    if (completed) {
      return;
    }
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      await handleBodyParser(this.request);
    }
    handleMiddlewares(this.request, this.response, matchedRoute.callbacks);
  }
}

module.exports = Router;
