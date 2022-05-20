/* eslint-disable no-restricted-globals */
/* eslint-disable radix */
/* eslint-disable class-methods-use-this */
const fs = require('fs');
const path = require('path');
const produtosjson = require('../../data/produtosjson');
const { modelResponseError } = require('../../util');
const { createError } = require('../../util/errors');

require('dotenv').config();

const modelResponse = (response)=> response.map((item)=> ({
  id: item.id,
  nome: item.name,
  image: `/produtosjson/image/${item.image}`,
  preco: item.price,
  estoque: item.amount,
  detalhes: item.details,
  categoria: item.categorie,
  criado: new Date(item.createdAt).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
}));

class ProdutosJsonService {
  async getItens(id) {
    if (id) {
      if (!isNaN(id)) {
        const product = produtosjson.filter((item)=> item.id === parseInt(id));
        return product.length > 0 ? modelResponse(product) : modelResponseError('Produto não encontrado', createError(`Não foi possível encontrar o produto ${id}`, 404));
      }
      return modelResponseError('Produto não encontrado', createError(`Não foi possível encontrar o produto ${id}`, 404));
    }
    return modelResponse(produtosjson);
  }

  async getImage(name) {
    const source = path.resolve(__dirname, '..', '..', '..', 'public', 'images', 'produtosjson', name);
    try {
      return fs.readFileSync(source, (error, data)=> {
        if (error) {
          throw new Error();
        }
        return data;
      });
    } catch (error) {
      return modelResponseError('Erro durante o carregamento da imagem', createError('Não foi possível encontrar a imagem', 404));
    }
  }
}

module.exports = new ProdutosJsonService();
