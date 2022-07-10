/* eslint-disable class-methods-use-this */
const fs = require('fs');
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
      const image = fs.readFileSync(source, (error, data)=> {
        if (error) {
          throw new Error();
        }
        return data;
      });
      response.writeHead(200, {
        'Content-Type': 'image/jpeg',
      });
      return response.end(image);
    } catch {
      const error = await modelResponseError('Erro durante o carregamento da imagem', customError[404]).catch((data)=> data);
      response.writeHead(error.details.status);
      return response.end(JSON.stringify(error));
    }
  }
}

module.exports = new Controller();
