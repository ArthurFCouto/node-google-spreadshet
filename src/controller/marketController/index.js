const { Context, Market } = require('../../service/googlesheetsservice');

class MarketController {
  async getAll(request, response) {
    const context = new Context(new Market());
    const data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new Market());
    const { id } = request.path;
    const data = await context.getById(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async save(request, response) {
    const context = new Context(new Market());
    const { body } = request;
    const data = await context.create(body);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }

  async delete(request, response) {
    const context = new Context(new Market());
    const { id } = request.path;
    const data = await context.delete(id);
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    response.end(JSON.stringify(data));
  }
}

module.exports = new MarketController();
