/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
const { GoogleSpreadsheet } = require('google-spreadsheet');
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

  async _searchForExisting(code) {
    const rows = await this._getRows();
    return rows.filter((row)=> row.codigo_produto.toString() === code.toString());
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
    const user = emailUsuario && await contextUser.getById(emailUsuario);
    if (!user || user.id !== 0) {
      error.push({
        field: 'emailUsuario',
        error: 'Erro ao buscar usu??rio pelo email',
        value: emailUsuario || '',
      });
    }
    const market = cnpjMercado && await contextMarket.getById(cnpjMercado);
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
        error: 'C??digo do produto n??o enviado',
        value: codigoProduto || '',
      });
    }
    if (!precoAtual || isNaN(precoAtual)) {
      error.push({
        field: 'precoAtual',
        error: 'Pre??o do produto n??o enviado ou inv??lido',
        value: precoAtual || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return modelResponsePrice(rows);
    } catch (error) {
      return modelResponseError('Ops! Erro ao buscar pre??os cadastrados', error);
    }
  }

  async create(data) {
    try {
      let response;
      const validate = await this._validatePrice(data);
      if (validate.length > 0) {
        return modelResponseError('Ops! N??o foi poss??vel cadastrar o pre??o', { ...customError[400], data: validate });
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
      /*
       * Acima foi verificado se j?? existe um pre??o para o produto informado no cnpj informado.
       * Caso tenha o return ?? feito neste ponto
       */
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
          throw error;
        });
      return modelResponsePrice(response);
    } catch (error) {
      return modelResponseError('Ops! Erro durante o cadastro do pre??o', error);
    }
  }

  async getById(id) {
    try {
      const list = id && await this._searchForExisting(id);
      if (list.length > 0) {
        return modelResponsePrice(list);
      }
      return modelResponseError(`Ops! Ainda n??o h?? pre??os atuais cadastrados para o produto com c??digo ${id}`, customError[404]);
    } catch (error) {
      return modelResponseError(`Ops! Erro durante a pesquisa do c??digo ${id}`, error);
    }
  }

  async delete(id) {
    try {
      const list = id && await this._searchForExisting(id);
      if (list.length > 0) {
        list.map(async (row)=> row.del());
        /*
         * Quando h?? muitas linhas a excluir, o programa n??o exclui todas, por isso ?? preciso a recursividade
         */
        const newlist = await this._searchForExisting(id);
        if (newlist.length > 0) {
          return this.delete(id);
        }
        return modelResponsePrice(list);
      }
      return modelResponseError(`Ops! Ainda n??o h?? pre??os atuais cadastrados para o produto com c??digo ${id}`, customError[404]);
    } catch (error) {
      return modelResponseError('Ops! Erro durante a exclus??o do pre??o', error);
    }
  }
}

module.exports = PriceStrategy;
