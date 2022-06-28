/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
const { Context, Market } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');
const config = require('../../server/config');

const { roles } = config;

class MarketController {
  static _checkAdministrador(request, response) {
    response.writeHead(403);
    return response.end(JSON.stringify({
      error: 'Ops! Usuário sem autorização para a operação',
      details: customError[403],
    }));
  }

  static _checkLogin(request, response) {
    response.writeHead(401);
    return response.end(JSON.stringify({
      error: 'Ops! Usuário não autenticado',
      details: customError[401],
    }));
  }

  async getAll(request, response) {
    const context = new Context(new Market());
    const data = await context.getAll().catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new Market());
    const { cnpj } = request.path;
    if (cnpj) {
      const data = await context.getById(cnpj).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um mercado com os dados enviados',
      details: customError[404],
    }));
  }

  async save(request, response) {
    const { user } = request;
    if (!user.role) {
      return this._checkLogin(request, response);
    }
    if (user.role !== roles.admin) {
      return this._checkAdministrador(request, response);
    }
    const context = new Context(new Market());
    const { body } = request;
    const data = await context.create(body).catch((error)=> error);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async delete(request, response) {
    const { user } = request;
    if (!user.role) {
      return this._checkLogin(request, response);
    }
    if (user.role !== roles.admin) {
      return this._checkAdministrador(request, response);
    }
    const context = new Context(new Market());
    const { cnpj } = request.path;
    if (cnpj) {
      const data = await context.delete(cnpj).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um mercado com os dados enviados',
      details: customError[404],
    }));
  }
}

module.exports = new MarketController();
