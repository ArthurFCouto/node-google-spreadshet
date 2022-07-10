/* eslint-disable consistent-return */
const RouteNotFoundError = require('./handleRouterNotFoundError');
const handleRegex = require('./handleRegex');
const handleBodyParser = require('./handleBodyParser');
const handleMiddlewares = require('./handleMiddlewares');

class handlerRouter {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.routes = [];
    this.method = undefined;
    this.path = undefined;
  }

  static create(request, response) {
    return new this(request, response);
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
   * Será executado somente se o response.end() não tiver sido chamado
   */
  use(callback) {
    const { finished } = this.response;
    if (!finished) {
      callback(this.request, this.response);
    }
  }

  async exec() {
    const { method } = this.request;
    const { finished } = this.response;
    const matchedRoute = this.routes.find((route)=> {
      const isMatch = handleRegex(this.request, route.path);
      return (method === route.method && isMatch) ? route : undefined;
    });
    if (!matchedRoute) {
      throw new RouteNotFoundError(method, this.request.url);
    }
    if (finished) {
      return;
    }
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      await handleBodyParser(this.request);
    }
    return handleMiddlewares(this.request, this.response, matchedRoute.callbacks);
  }
}

module.exports = handlerRouter;
