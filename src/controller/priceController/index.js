/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
const { Context, Price } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');

class PriceController {
  _checkLogin(request, response) {
    response.writeHead(401);
    return response.end(JSON.stringify({
      error: 'Ops! Usuário não autenticado',
      details: customError[401],
    }));
  }

  async getAll(request, response) {
    const context = new Context(new Price());
    const data = await context.getAll().catch((error)=> error);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new Price());
    const { id } = request.path;
    if (id) {
      const data = await context.getById(id).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado precos com os dados enviados',
      details: customError[404],
    }));
  }

  async save(request, response) {
    const { user } = request;
    if (!user.role) {
      return this._checkLogin(request, response);
    }
    const context = new Context(new Price());
    const { body } = request;
    const data = await context.create({ ...body, emailUsuario: user.email }).catch((error)=> error);
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
    const { id } = request.path;
    if (id) {
      const context = new Context(new Price());
      const data = await context.delete(id).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado precos com os dados enviados',
      details: customError[404],
    }));
  }
}

module.exports = new PriceController();
