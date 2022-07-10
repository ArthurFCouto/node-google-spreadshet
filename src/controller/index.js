const { readFile } = require('fs/promises');
const path = require('path');
/*
  Função criada com o unico intuido de trabalhar a leitura de arquivos e disponibilizar ao cliente
*/
class Controller {
  async getLogo(request, response) {
    const source = path.resolve(__dirname, '..', '..', 'public', 'logo.png');
    const image = await readFile(source);
    response.setHeader('Content-Type', 'image/png');
    response.end(image);
  }
}

module.exports = new Controller();
