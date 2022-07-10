<<<<<<< HEAD
const { readFile } = require('fs/promises');
=======
/* eslint-disable class-methods-use-this */
const fs = require('fs');
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c
const path = require('path');
/*
  Função criada com o unico intuido de trabalhar a leitura de arquivos e disponibilizar ao cliente
*/
class Controller {
  async getLogo(request, response) {
    const source = path.resolve(__dirname, '..', '..', 'public', 'logo.png');
<<<<<<< HEAD
    const image = await readFile(source);
    response.setHeader('Content-Type', 'image/png');
    response.end(image);
=======
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
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c
  }
}

module.exports = new Controller();
