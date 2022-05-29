/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const CustomInterface = require('./base/interface');
const { stringIncludes } = require('../../../util');
const { modelResponseError, modelResponseProduct } = require('../../../util/modelsResponse');
require('dotenv').config();

const handleError = {
  401: {
    status: 401,
    statusText: 'Bad request',
    data: 'Produto já cadastrado',
  },
  404: {
    status: 404,
    statusText: 'Not found',
    data: 'Produto não encontrado',
  },
};

class ProductStrategy extends CustomInterface {
  constructor() {
    super();
    this._error = null;
  }

  // Retorna a conexão com o google planilhas
  async _getDocument() {
    try {
      const document = new GoogleSpreadsheet(ws.id);
      // Propriedade private_key com replace, para evitar problemas pois está no arquivo .env
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

  // Retorna as linhas da planilha de produtos
  async _getRows() {
    try {
      return this._getDocument().then(async (response)=> {
        const sheet = response.sheetsByIndex[1];
        return sheet.getRows().then((rows)=> rows);
      });
    } catch (error) {
      console.error('Erro ao recuperar as linhas da planilha', error);
      this._error = error;
      throw new Error();
    }
  }

  // Retorna a planilha de produtos
  async _getSheet() {
    try {
      return this._getDocument().then(async (response)=> response.sheetsByIndex[1]);
    } catch (error) {
      console.error('Erro ao recuperar a planilha', error);
      this._error = error;
      throw new Error();
    }
  }

  // Verifica se existe o produto com o ID e o retorna
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

  // Busca todos os produtos
  async getAll() {
    try {
      const rows = await this._getRows();
      return modelResponseProduct(rows);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', this._error);
    }
  }

  // Insere uma linha(produto) na planilha
  async create(data) {
    try {
      if (await this._checkExist(data.codigoProduto)) {
        return modelResponseError(`Ops! Produto com código ${data.codigoProduto} já cadastrado`, handleError[401]);
      }
      let product;
      const sheet = await this._getSheet();
      await sheet.addRow({
        descricao_produto: data.descricaoProduto,
        imagem_produto: data.imagemProduto,
        barcode_produto: data.barcodeProduto,
        preco_medio_nacional: data.precoMedioNacional || '0.00',
        codigo_produto: data.codigoProduto,
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> {
          product = res;
        })
        .catch((error)=> {
          console.error('Erro ao cadastrar o produto na planilha', error);
          this._error = error;
          throw new Error();
        });
      return modelResponseProduct(product);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante o cadastro do produto', this._error);
    }
  }

  // Busco um unico produto pelo código
  async getById(id) {
    try {
      const product = await this._checkExist(id);
      if (product) {
        return modelResponseProduct(product);
      }
      return modelResponseError(`O produto com código ${id} não está cadastrado`, handleError[404]);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', this._error);
    }
  }

  // Busca todos os produtos que contém na descrição a descrição enviada
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
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', this._error);
    }
  }

  // Deleta uma linha(produto) da planilha pelo código
  async delete(id) {
    try {
      const produto = await this._checkExist(id);
      if (produto) {
        const response = produto;
        await produto.del();
        return modelResponseProduct(response);
      }
      return modelResponseError(`O produto de código ${id} não está cadastrado`, handleError[404]);
    } catch {
      return modelResponseError('Ops! Ocorreu um erro durante a exclusão do produto', this._error);
    }
  }
}

module.exports = ProductStrategy;
