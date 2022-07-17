const { Context, Price } = require('../../service/googlesheetsservice');
const { modelPriceById } = require('./functions');

class PriceController {
  async getAll(request, response) {
    const context = new Context(new Price());
    const data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new Price());
    const { id } = request.path;
    const data = await context.getById(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
      response.end(JSON.stringify(data));
      return;
    }
    const responseData = await modelPriceById(data);
    response.end(JSON.stringify(responseData));
  }

  async save(request, response) {
    const context = new Context(new Price());
    const { email } = request.user;
    const { body } = request;
    const data = await context.create({ ...body, emailUsuario: email });
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async delete(request, response) {
    const { id } = request.path;
    const context = new Context(new Price());
    const data = await context.delete(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }
}

module.exports = new PriceController();
