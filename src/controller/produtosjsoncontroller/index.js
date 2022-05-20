/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
const produtoJsonService = require('../../service/produtosjsonservice');

class ProdutosJsonController {
  async getData(request, response) {
    response.writeHead(200);
    return response.end(JSON.stringify(await produtoJsonService.getItens().catch((error)=> error)));
  }

  async getById(request, response) {
    const { id } = request.path;
    const data = await produtoJsonService.getItens(id).catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
      return response.end(JSON.stringify(data));
    }
    response.writeHead(200);
    return response.end(JSON.stringify(data[0]));
  }

  async getImage(request, response) {
    const { name } = request.path;
    const data = await produtoJsonService.getImage(name).catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
      return response.end(JSON.stringify(data));
    }
    response.writeHead(200, {
      'Content-Type': 'image/jpeg',
    });
    return response.end(data);
  }
}

module.exports = new ProdutosJsonController();
