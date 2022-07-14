/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const CustomInterface = require('./base/interface');
const { stringIncludes } = require('../../../util');
const customError = require('../../../util/error');
const { modelResponseError, modelResponseProduct } = require('../../../util/modelsResponse');

require('dotenv').config();

class ProductStrategy extends CustomInterface {
  constructor() {
    super();
    this._index = 1;
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

  async _checkExist(id) {
    if (typeof id === 'string' || typeof id === 'number') {
      const rows = await this._getRows();
      return rows.find((row)=> row.codigo_produto.toString() === id.toString());
    }
    return undefined;
  }

  _validateProduct(data) {
    const error = [];
    if (typeof data !== 'object') {
      data = {};
    }
    const {
      precoMedioNacional, detalheProduto, descricaoProduto, codigoProduto,
    } = data;
    if (!descricaoProduto || descricaoProduto.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'descricaoProduto',
        error: 'Campo não enviado',
        value: '',
      });
    }
    if (!descricaoProduto || detalheProduto.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'detalheProduto',
        error: 'Campo não enviado',
        value: '',
      });
    }
    if (precoMedioNacional !== null) {
      if (precoMedioNacional === undefined || isNaN(precoMedioNacional)) {
        error.push({
          field: 'precoMedioNacional',
          error: 'Campo não enviado ou em formato inválido',
          value: '',
        });
      }
    }
    if (!codigoProduto || !(/^\d+$/.test(codigoProduto))) {
      error.push({
        field: 'codigoProduto',
        error: 'Campo não enviado ou em formato inválido',
        value: codigoProduto || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return modelResponseProduct(rows);
    } catch (error) {
      return modelResponseError('Ops! Erro ao buscar produtos cadastrados', error);
    }
  }

  async create(data) {
    try {
      const validate = this._validateProduct(data);
      if (validate.length > 0) {
        return modelResponseError('Ops! Não foi possível cadastrar o produto', { ...customError[400], data: validate });
      }
      if (await this._checkExist(data.codigoProduto)) {
        return modelResponseError('Ops! Este produto já cadastrado', customError[400]);
      }
      const sheet = await this._getSheet();
      return sheet.addRow({
        descricao_produto: data.descricaoProduto,
        barcode_produto: data.barcodeProduto,
        imagem_produto: data.imagemProduto,
        detalhe_produto: data.detalheProduto,
        preco_medio_nacional: data.precoMedioNacional || '0.00',
        marca_produto: data.marcaProduto,
        categoria_produto: data.categoriaProduto,
        codigo_produto: data.codigoProduto,
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((response)=> modelResponseProduct(response))
        .catch((error)=> {
          throw error;
        });
    } catch (error) {
      return modelResponseError('Ops! Erro durante o cadastro de um produto', error);
    }
  }

  async getById(id) {
    try {
      const product = await this._checkExist(id);
      if (product) {
        return modelResponseProduct(product);
      }
      return modelResponseError(`Ops! O produto com código ${id} não está cadastrado`, customError[404]);
    } catch (error) {
      return modelResponseError(`Ops! Erro durante a pesquisa do código ${id}`, error);
    }
  }

  async getByDescription(description) {
    try {
      if (typeof description === 'string' || typeof description === 'number') {
        const rows = await this._getRows();
        const products = rows.filter((row)=> (stringIncludes(row.descricao_produto, description)));
        return modelResponseProduct(products);
      }
      return modelResponseProduct([]);
    } catch (error) {
      return modelResponseError('Ops! Erro durante a pesquisa pela descrição', error);
    }
  }

  async delete(id) {
    try {
      const produto = await this._checkExist(id);
      if (produto) {
        const response = produto;
        await produto.del();
        return modelResponseProduct(response);
      }
      return modelResponseError(`Ops! O produto com código ${id} não está cadastrado`, customError[404]);
    } catch (error) {
      return modelResponseError(`Ops! Erro durante a exclusão do código ${id}`, error);
    }
  }
}

module.exports = ProductStrategy;
