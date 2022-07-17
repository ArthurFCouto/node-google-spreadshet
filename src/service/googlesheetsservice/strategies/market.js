/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const customError = require('../../../util/error');
const { modelResponseError, modelResponseMarket } = require('../../../util/modelsResponse');
const customInterface = require('./base/interface');

require('dotenv').config();

class marketStrategies extends customInterface {
  constructor() {
    super();
    this._index = 3;
  }

  async _getDocument() {
    try {
      const document = new GoogleSpreadsheet(process.env.ID_WORKSHEET);
      await document.useServiceAccountAuth({
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      });
      await document.loadInfo();
      return document;
    } catch (error) {
      console.error('Erro ao conectar com servidor GoogleSpreadsheet', error);
      throw error;
    }
  }

  async _getRows() {
    try {
      const response = await this._getDocument();
      const sheet = response.sheetsByIndex[this._index];
      return sheet.getRows();
    } catch (error) {
      console.error('Erro ao recuperar as linhas da planilha', error);
      throw error;
    }
  }

  async _getSheet() {
    try {
      const response = await this._getDocument();
      return response.sheetsByIndex[this._index];
    } catch (error) {
      console.error('Erro ao recuperar a planilha', error);
      throw error;
    }
  }

  async _checkExist(cnpj) {
    const rows = await this._getRows();
    return rows.find((row)=> row.cnpj_mercado.toLowerCase() === cnpj);
  }

  _validateMarket(data) {
    const error = [];
    if (typeof data !== 'object') {
      data = {};
    }
    const {
      cnpjMercado, nomeMercado, telefoneMercado, cidadeMercado, cepMercado,
    } = data;
    if (!nomeMercado || nomeMercado.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'nomeMercado',
        error: 'Campo não enviado ou vazio',
        value: nomeMercado || '',
      });
    }
    if (!cidadeMercado || cidadeMercado.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'cidadeMercado',
        error: 'Campo não enviado ou vazio',
        value: cidadeMercado || '',
      });
    }
    if (!cepMercado || !(/^\d{8}$/).test(cepMercado)) {
      error.push({
        field: 'cepMercado',
        error: 'Campo não enviado ou com formato inválido',
        value: cepMercado || '',
      });
    }
    if (!cnpjMercado || !(/^\d{14}$/).test(cnpjMercado)) {
      error.push({
        field: 'cnpjMercado',
        error: 'Campo não enviado ou com formato inválido',
        value: cnpjMercado || '',
      });
    }
    if (!telefoneMercado || !(/^\d{11}$/.test(telefoneMercado))) {
      error.push({
        field: 'telefoneMercado',
        error: 'Campo não enviado ou com formato inválido',
        value: telefoneMercado || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return rows.map((market)=> (modelResponseMarket(market)));
    } catch (error) {
      return modelResponseError('Ops! Erro ao buscar mercados cadastrados', error);
    }
  }

  async create(data) {
    try {
      const validate = this._validateMarket(data);
      if (validate.length > 0) {
        return modelResponseError('Ops! Não foi possível cadastrar o mercado', { ...customError[400], data: validate });
      }
      if (await this._checkExist(data.cnpjMercado)) {
        return modelResponseError('Ops! CNPJ já cadastrado', customError[400]);
      }
      const sheet = await this._getSheet();
      return sheet.addRow({
        cnpj_mercado: data.cnpjMercado,
        nome_mercado: data.nomeMercado,
        endereco_mercado: data.enderecoMercado,
        numero_mercado: data.numeroMercado,
        complemento_mercado: data.complementoMercado,
        telefone_mercado: data.telefoneMercado,
        cidade_mercado: data.cidadeMercado,
        cep_mercado: data.cepMercado,
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> modelResponseMarket(res))
        .catch((error)=> {
          throw error;
        });
    } catch (error) {
      return modelResponseError('Ops! Erro durante o cadastro do mercado', error);
    }
  }

  async getById(id) {
    try {
      const market = id && await this._checkExist(id);
      if (market) {
        return modelResponseMarket(market);
      }
      return modelResponseError(`Ops! O mercado com CNPJ ${id} não está cadastrado`, customError[404]);
    } catch (error) {
      return modelResponseError('Ops! Erro durante a busca pelo CNPJ', error);
    }
  }

  async delete(id) {
    try {
      const market = await this._checkExist(id);
      if (market) {
        const response = modelResponseMarket(market);
        await market.del();
        return response;
      }
      return modelResponseError(`Ops! O mercado com CNPJ ${id} não está cadastrado`, customError[404]);
    } catch (error) {
      return modelResponseError('Ops! Erro durante a exlusão do mercado', error);
    }
  }
}

module.exports = marketStrategies;
