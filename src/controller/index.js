/* eslint-disable class-methods-use-this */
const { readFile } = require('fs/promises');
const path = require('path');
const { modelResponseError } = require('../util/modelsResponse');
const customError = require('../util/error');
/*
  Função criada com o unico intuido de trabalhar a leitura de arquivos e disponibilizar ao cliente
*/
class Controller {
  async getLogo(request, response) {
    const source = path.resolve(__dirname, '..', '..', 'public', 'logo.png');
    try {
      const image = await readFile(source);
      response.setHeader('Content-Type', 'image/png');
      response.end(image);
    } catch (error) {
      console.error(error);
      const errorResponse = modelResponseError('Erro durante o carregamento da imagem', customError[404]);
      response.writeHead(errorResponse.details.status);
      response.end(JSON.stringify(errorResponse));
    }
  }
}

module.exports = new Controller();
