/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const cosmos = require('bluesoft-cosmos-api');
const axios = require('axios').default;
const { modelResponseProduct, modelResponseError } = require('../../util/modelsResponse');

require('dotenv').config();

async function handleResults(url) {
  return axios.get(url, {
    headers: {
      'X-Cosmos-Token': process.env.COSMOS_TOKEN,
    },
  })
    .then((response)=> modelResponseProduct(response.data, 'cosmos'))
    .catch((error)=> (modelResponseError('Ops! Ocorreu um erro durante a pesquisa', error)));
}

class CosmosService {
  async geBytLins(lins) {
    cosmos.setToken(process.env.COSMOS_TOKEN);
    return cosmos.gtins(lins)
      .then((response)=> modelResponseProduct(response.data, 'cosmos'))
      .catch((error)=> modelResponseError('Ops! Ocorreu um erro durante a pesquisa', error));
  }

  getByDescription(description) {
    /*
      Remove os caracteres especiais e depois substitui os espaços em branco por '+'.
    */
    const query = description.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '+');
    const url = `${process.env.COSMOS_ENDPOINT}/products?query=${query}`;
    return handleResults(url);
  }

  getByNextPage(url) {
    /*
      Válida se é uma url válida.
    */
    const validation = /^((http(s?):\/\/(api.)?[a-z]+.?[a-z]+.com.br\/))/;
    return validation.test(url) ? handleResults(url) : modelResponseError('Ops! Ocorreu um erro durante a pesquisa', { status: 400, statusText: 'Bad Request', data: 'Parâmetro url inválido' });
  }
}

module.exports = new CosmosService();
