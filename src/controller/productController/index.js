/* eslint-disable no-restricted-globals */
const cosmosService = require('../../service/cosmosservice');
const { Context, Product } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');

class ProductController {
  async getAll(request, response) {
    const context = new Context(new Product());
    const data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async getByDescription(request, response) {
    const context = new Context(new Product());
    const { description, database } = request.params;
    if (description) {
      let data = {};
      if (database && database.toUpperCase() === 'COSMOS') {
        data = await cosmosService.getByDescription(description);
      } else {
        data = await context.getByDescription(description);
      }
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      response.end(JSON.stringify(data));
      return;
    }
    response.writeHead(400);
    response.end(JSON.stringify({
      error: 'Ops! Favor enviar o parametro description',
      details: customError[400],
    }));
  }

  async getById(request, response) {
    const context = new Context(new Product());
    const { id } = request.path;
    let data = await context.getById(id);
    if (data && !data.error) {
      response.end(JSON.stringify(data));
      return;
    }
    data = await cosmosService.geBytLins(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
    } else {
      /*
       * Não foi utilizado o await pois não é necessário aguardar o cadastro para enviar a resposta ao usuário
       */
      context.create(data);
    }
    response.end(JSON.stringify(data));
  }

  async getNextPage(request, response) {
    const { page, query } = request.params;
    if (page && query) {
      const data = await cosmosService.getByNextPage(page, query);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      response.end(JSON.stringify(data));
      return;
    }
    response.writeHead(400);
    response.end(JSON.stringify({
      error: 'Ops! Conferir os parametros page e query',
      details: customError[400],
    }));
  }

  async delete(request, response) {
    const context = new Context(new Product());
    const { id } = request.path;
    const data = await context.delete(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }
}

module.exports = new ProductController();
