/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const cosmos = require('bluesoft-cosmos-api');
const axios = require('axios').default;
const { modelResponseProduct, modelResponseError, modelResponseProductList } = require('../../util');

require('dotenv').config();

async function handleResults(url) {
  return axios.get(url, {
    headers: {
      'X-Cosmos-Token': process.env.TOKEN,
    },
  })
    .then((response)=> modelResponseProductList(response.data, 'cosmos'))
    .catch((error)=> (modelResponseError('Ops! Ocorreu um erro durante a pesquisa', error)));
}

class CosmosService {
  async geBytLins(lins) {
    cosmos.setToken(process.env.TOKEN);
    return cosmos.gtins(lins)
      .then((response)=> modelResponseProduct(response.data, 'cosmos'))
      .catch((error)=> modelResponseError('Ops! Ocorreu um erro durante a pesquisa', error));
  }

  getByDescription(description) {
    // Remove os caracteres especiais e depois substitui os espaços em branco por '+'
    const query = description.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '+');
    const url = `${process.env.COSMOS_ENDPOINT}/products?query=${query}`;
    return handleResults(url);
  }

  getByNextPage(url) {
    return handleResults(url);
  }
}

module.exports = new CosmosService();
