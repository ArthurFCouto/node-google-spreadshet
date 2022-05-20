/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
const cosmosService = require('../../service/cosmosservice');
const datoService = require('../../service/datoservice');

class CosmosController {
  async getDataDatoCMS(request, response) {
    const data = await datoService.getAllProduct().catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
      return response.end(JSON.stringify(data));
    }
    response.writeHead(200);
    return response.end(JSON.stringify(data));
  }

  async getByDescription(request, response) {
    const { description, method } = request.params;
    if (description && method && (method.toUpperCase() === 'DATOCMS' || method.toUpperCase() === 'COSMOS')) {
      let data = {};
      let status = 200;
      if (method.toUpperCase() === 'DATOCMS') {
        data = await datoService.getProductByDescription(description).catch((error)=> error);
        if (data && !data.error && data.listaProduto.length === 0) {
          data = await cosmosService.getByDescription(description).catch((error)=> error);
        }
        if (data.error) {
          status = data.details.status;
        }
      } else {
        data = await cosmosService.getByDescription(description).catch((error)=> error);
        if (data && data.error) {
          status = data.details.status;
        }
      }
      response.writeHead(status);
      return response.end(JSON.stringify(data));
    }
    response.writeHead(401);
    return response.end(JSON.stringify({
      error: 'Erro no envio dos parâmetros',
      details: {
        status: '401',
        statusText: 'Bad request',
        data: 'Favor verificar os parâmetros description e method enviados',
      },
    }));
  }

  async getById(request, response) {
    const { id } = request.path;
    response.writeHead(200);
    let data = await datoService.getProductByCode(id).catch((error)=> error);
    if (!data.error) {
      return response.end(JSON.stringify(data));
    }
    data = await cosmosService.geBytLins(id).catch((error)=> error);
    if (data.error) {
      response.writeHead(data.details.status);
    } else {
      datoService.createProduct(data).then((product)=> console.log('Cadastro no DatoCMS: OK', product)).catch((error)=> console.log('Cadastro no DatoCMS: Fail', JSON.stringify(error)));
    }
    return response.end(JSON.stringify(data));
  }

  async getNextPage(request, response) {
    const { url } = request;
    const query = url.indexOf('=') !== -1 && url.slice(url.indexOf('=') + 1, url.length);
    const validation = /^((http(s?):\/\/(api.)?[a-z]+.?[a-z]+.com.br\/))/;
    const custom = {};
    if (query && validation.test(query)) {
      custom.status = 200;
      custom.data = await cosmosService.getByNextPage(query);
      if (custom.data.error) {
        custom.status = custom.data.details.status || 401;
      }
      response.writeHead(custom.status);
      return response.end(JSON.stringify(custom.data));
    }
    response.writeHead(401);
    return response.end(JSON.stringify({
      error: 'Erro no envio dos parâmetros',
      details: {
        status: '401',
        statusText: 'Bad request',
        data: 'Url inválida',
      },
    }));
  }

  async deleteProduct(request, response) {
    const { id } = request.path;
    const custom = { };
    if ((id) && (!isNaN(id))) {
      custom.status = 200;
      custom.data = await datoService.destroy(id).catch((error)=> error);
      if (custom.data.error) {
        custom.status = custom.data.details.status || 401;
      }
      response.writeHead(custom.status);
      return response.end(JSON.stringify(custom.data));
    }
    response.writeHead(401);
    return response.end(JSON.stringify({
      error: 'Erro no envio dos parâmetros',
      details: {
        status: '401',
        statusText: 'Bad request',
        data: 'Enviar um ID válido',
      },
    }));
  }
}

module.exports = new CosmosController();
