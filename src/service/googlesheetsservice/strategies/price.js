/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const CustomInterface = require('./base/interface');
const customError = require('../../../util/error');
const { modelResponseError, modelResponsePrice } = require('../../../util/modelsResponse');
const Market = require('./market');
const User = require('./user');

require('dotenv').config();

class PriceStrategy extends CustomInterface {
  constructor() {
    super();
    this._index = 2;
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

  async _searchForExisting(code) {
    const prices = [];
    const rows = await this._getRows();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].codigo_produto.toString() === code.toString()) {
        prices.push(rows[i]);
      }
    }
    return prices;
  }

  async _validatePrice(data) {
    const error = [];
    const contextMarket = new Market();
    const contextUser = new User();
    if (typeof data !== 'object') {
      data = {};
    }
    const {
      emailUsuario, cnpjMercado, codigoProduto, precoAtual,
    } = data;
    const user = emailUsuario && await contextUser.getById(emailUsuario).catch((erro)=> erro);
    if (!user || user.id !== 0) {
      error.push({
        field: 'emailUsuario',
        error: 'Erro ao buscar usuário pelo email',
        value: emailUsuario || '',
      });
    }
    const market = cnpjMercado && await contextMarket.getById(cnpjMercado).catch((erro)=> erro);
    if (!market || market.id !== 0) {
      error.push({
        field: 'cnpjMercado',
        error: 'Erro ao buscar mercado pelo CNPJ',
        value: cnpjMercado || '',
      });
    }
    if (!codigoProduto) {
      error.push({
        field: 'codigoProduto',
        error: 'Código do produto não enviado',
        value: codigoProduto || '',
      });
    }
    if (!precoAtual || isNaN(precoAtual)) {
      error.push({
        field: 'precoProduto',
        error: 'Preço do produto não enviado ou inválido',
        value: precoAtual || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return modelResponsePrice(rows);
    } catch {
      return modelResponseError('Ops! Erro ao buscar preços cadastrados', this._error);
    }
  }

  async create(data) {
    try {
      let response;
      const validate = await this._validatePrice(data);
      if (validate.length > 0) {
        return modelResponseError('Ops! Não foi possível cadastrar o preço', { ...customError[400], data: validate });
      }
      const list = await this._searchForExisting(data.codigoProduto);
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].cnpj_mercado.toString() === data.cnpjMercado) {
            list[i].preco_produto = data.precoAtual;
            list[i].email_usuario = data.emailUsuario;
            list[i]._updatedAt = new Date().toLocaleString('pt-BR', { timeZone: 'UTC' });
            await list[i].save();
            response = list[i];
            break;
          }
        }
      }
      if (response) {
        return modelResponsePrice(response);
      }
      const sheet = await this._getSheet();
      await sheet.addRow({
        codigo_produto: data.codigoProduto,
        preco_produto: data.precoAtual,
        email_usuario: data.emailUsuario,
        cnpj_mercado: data.cnpjMercado,
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> {
          response = res;
        })
        .catch((error)=> {
          this._error = error;
          throw new Error();
        });
      return modelResponsePrice(response);
    } catch {
      return modelResponseError('Ops! Erro durante o cadastro do preço', this._error);
    }
  }

  async getById(id) {
    try {
      const list = id && await this._searchForExisting(id);
      if (list.length > 0) {
        return modelResponsePrice(list);
      }
      return modelResponseError(`Ops! Ainda não há preços atuais cadastrados para o produto com código ${id}`, customError[404]);
    } catch {
      return modelResponseError(`Ops! Erro durante a pesquisa do código ${id}`, customError[500]);
    }
  }

  async delete(id) {
    try {
      const list = id && await this._searchForExisting(id);
      if (list.length > 0) {
        list.map(async (row)=> { await row.del(); });
        const newlist = await this._searchForExisting(id);
        if (newlist.length > 0) {
          return this.delete(id);
        }
        return modelResponsePrice(list);
      }
      return modelResponseError(`Ops! Ainda não há preços atuais cadastrados para o produto com código ${id}`, customError[404]);
    } catch {
      return modelResponseError('Ops! Erro durante a exclusão do preço', customError[500]);
    }
  }
}

module.exports = PriceStrategy;
