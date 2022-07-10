/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
const cosmos = require('bluesoft-cosmos-api');
const axios = require('axios').default;
const { modelResponseProduct, modelResponseError } = require('../../util/modelsResponse');
const customError = require('../../util/error');

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
    if (!isNaN(lins)) {
      return cosmos.gtins(lins)
        .then((response)=> modelResponseProduct(response.data, 'cosmos'))
        .catch((error)=> modelResponseError('Ops! Ocorreu um erro durante a pesquisa', error));
    }
    return modelResponseError('Ops! Código com formato inválido', customError[400]);
  }

  getByDescription(description) {
    if (typeof description === 'string') {
      const query = description.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '+');
      const url = `${process.env.COSMOS_ENDPOINT}/products?query=${query}`;
      return handleResults(url);
    }
    return modelResponseError('Ops! Descrição não enviada ou com formato inválido', customError[400]);
  }

  getByNextPage(page, query) {
    if (page && query && !isNaN(page) && (typeof query === 'string' || typeof query === 'number')) {
      const url = `${process.env.COSMOS_ENDPOINT}/products?page=${page}&query=${query}`;
      return handleResults(url);
    }
    return modelResponseError('Ops! Os parâmetros enviados são inválidos', customError[400]);
  }
}

module.exports = new CosmosService();
