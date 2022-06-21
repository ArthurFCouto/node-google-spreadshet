/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const customError = require('../../../util/error');
const { modelResponseError, modelResponseMarket } = require('../../../util/modelsResponse');
const customInterface = require('./base/interface');

require('dotenv').config();

class marketStrategies extends customInterface {
  constructor() {
    super();
    this._index = 3;
    this._error = null;
  }

  async _getDocument() {
    try {
      const document = new GoogleSpreadsheet(ws.id);
      await document.useServiceAccountAuth({
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      await document.loadInfo();
      return document;
    } catch (error) {
      console.error('Erro ao conectar com servidor GoogleSpreadsheet', error);
      this._error = error;
      throw new Error();
    }
  }

  async _getRows() {
    try {
      return this._getDocument().then(async (response)=> {
        const sheet = response.sheetsByIndex[this._index];
        return sheet.getRows().then((rows)=> rows);
      });
    } catch (error) {
      console.error('Erro ao recuperar as linhas da planilha', error);
      this._error = error;
      throw new Error();
    }
  }

  async _getSheet() {
    try {
      return this._getDocument().then(async (response)=> response.sheetsByIndex[this._index]);
    } catch (error) {
      console.error('Erro ao recuperar a planilha', error);
      this._error = error;
      throw new Error();
    }
  }

  async _checkExist(cnpj) {
    let market;
    const rows = await this._getRows();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].cnpj_mercado.toLowerCase() === cnpj) {
        market = rows[i];
        break;
      }
    }
    return market;
  }

  _validateMarket(data) {
    const error = [];
    const {
      cnpjMercado, nomeMercado, enderecoMercado, numeroMercado, complementoMercado, telefoneMercado, cidadeMercado, cepMercado,
    } = data;
    if (!nomeMercado || nomeMercado.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'nomeMercado',
        error: 'Campo não enviado ou vazio',
        value: nomeMercado || '',
      });
    }
    if (!cidadeMercado || cidadeMercado.replace(/\s/g, '').length === 0) {
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
    } catch {
      return modelResponseError('Erro ao buscar todos os mercados ', this._error);
    }
  }

  async create(data) {
    try {
      const validate = this._validateMarket(data);
      if (validate.length > 0) {
        return modelResponseError('Erro ao cadastrar mercado', { ...customError[401], data: validate });
      }
      if (await this._checkExist(data.cnpjMercado)) {
        return modelResponseError('CNPJ já cadastrado', customError[401]);
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
          console.log('Houve um erro ao criar mercado', error);
          this._error = error;
          throw new Error();
        });
    } catch {
      return modelResponseError('Houve um erro ao criar mercado', this._error);
    }
  }

  async getById(id) {
    try {
      const market = id && await this._checkExist(id);
      if (market) {
        return modelResponseMarket(market);
      }
      return modelResponseError('Erro ao buscar mercado', customError[404]);
    } catch {
      return modelResponseError('Erro ao buscar mercado pelo CNPJ', customError[500]);
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
      return modelResponseError('Erro ao deletar mercado', customError[404]);
    } catch {
      return modelResponseError('Erro ao deletar mercado pelo CNPJ', customError[500]);
    }
  }
}

module.exports = marketStrategies;
