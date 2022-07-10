/* eslint-disable no-restricted-globals */
const { Context, Price } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');

class PriceController {
  async getAll(request, response) {
    const context = new Context(new Price());
    const data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new Price());
    const { id } = request.path;
    if (id) {
      const data = await context.getById(id);
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
    const { email } = request.user;
    if (!email) {
      response.writeHead(401);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
    const context = new Context(new Price());
    const { body } = request;
    const data = await context.create({ ...body, emailUsuario: email });
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async delete(request, response) {
    const { role } = request.user;
    if (!role) {
      response.writeHead(401);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
    if (role !== roles.admin) {
      response.writeHead(403);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário sem autorização para a operação',
        details: customError[403],
      }));
    }
    const { id } = request.path;
    if (id) {
      const context = new Context(new Price());
      const data = await context.delete(id);
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
