const { readFile } = require('fs/promises');
const path = require('path');
const { modelResponseError } = require('../util/modelsResponse');
/*
  Função criada com o unico intuido de trabalhar a leitura de arquivos e disponibilizar ao cliente
*/
class Controller {
  async getLogo(request, response) {
    try {
      const source = path.resolve(__dirname, '..', '..', 'public', 'logo.png');
      const image = await readFile(source);
      response.setHeader('Content-Type', 'image/png');
      response.end(image);
    } catch (error) {
      const errorResponse = modelResponseError('Erro durante o carregamento da imagem', error);
      response.writeHead(errorResponse.details.status);
      response.end(JSON.stringify(errorResponse));
    }
  }
}

module.exports = new Controller();
