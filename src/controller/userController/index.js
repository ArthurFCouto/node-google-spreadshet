/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
const { Context, User } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');

class UserController {
  async getAll(request, response) {
    const context = new Context(new User());
    const data = await context.getAll().catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.getById(email).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um usuario com os dados enviados',
      details: customError[404],
    }));
  }

  async save(request, response) {
    const context = new Context(new User());
    const { body } = request;
    const data = await context.create(body).catch((error)=> error);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    return response.end(JSON.stringify(data));
  }

  async delete(request, response) {
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.delete(email).catch((error)=> error);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um usuario com os dados enviados',
      details: customError[404],
    }));
  }
}

module.exports = new UserController();
