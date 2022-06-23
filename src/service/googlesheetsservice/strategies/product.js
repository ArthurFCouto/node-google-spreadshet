/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const CustomInterface = require('./base/interface');
const { stringIncludes } = require('../../../util');
const customError = require('../../../util/error');
const { modelResponseError, modelResponseProduct } = require('../../../util/modelsResponse');
require('dotenv').config();

class ProductStrategy extends CustomInterface {
  constructor() {
    super();
    this._index = 1;
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

  async _checkExist(id) {
    let product;
    const rows = await this._getRows();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].codigo_produto.toString().toLowerCase() === id.toString().toLowerCase()) {
        product = rows[i];
        break;
      }
    }
    return product;
  }

  _validateProduct(data) {
    const error = [];
    const {
      descricaoProduto, detalheProduto, precoMedioNacional, codigoProduto,
    } = data;
    if (!descricaoProduto || descricaoProduto.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'descricaoProduto',
        error: 'Campo não enviado',
        value: '',
      });
    }
    if (!descricaoProduto || detalheProduto.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'detalheProduto',
        error: 'Campo não enviado',
        value: '',
      });
    }
    /*
      if (!precoMedioNacional || isNaN(precoMedioNacional)) {
        error.push({
          field: 'precoMedioNacional',
          error: 'Campo não enviado ou em formato inválido',
          value: '',
        });
      }
    */
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
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', this._error);
    }
  }

  async create(data) {
    try {
      data = data || {};
      const validate = await this._validateProduct(data);
      if (validate.length > 0) {
        return modelResponseError('Erro ao cadastrar produto', { ...customError[400], data: validate });
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
          console.error('Erro ao cadastrar o produto na planilha', error);
          this._error = error;
          throw new Error();
        });
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante o cadastro do produto', this._error);
    }
  }

  async getById(id) {
    try {
      const product = await this._checkExist(id);
      if (product) {
        return modelResponseProduct(product);
      }
      return modelResponseError(`O produto com código ${id} não está cadastrado`, customError[404]);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', customError[500]);
    }
  }

  async getByDescription(description) {
    try {
      const rows = await this._getRows();
      const product = [];
      rows.forEach((row)=> {
        const compare = row.descricao_produto;
        if (stringIncludes(compare, description)) {
          product.push(row);
        }
      });
      return modelResponseProduct(product);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', customError[500]);
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
      return modelResponseError(`O produto de código ${id} não está cadastrado`, customError[404]);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a exclusão do produto', customError[500]);
    }
  }
}

module.exports = ProductStrategy;
