/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const { modelResponseUser, modelResponseError } = require('../../../util/modelsResponse');
const customInterface = require('./base/interface');

require('dotenv').config();

const handleError = {
  401: {
    status: 401,
    statusText: 'Bad request',
    data: 'Já existe um usuário cadastrado com este e-mail',
  },
  404: {
    status: 404,
    statusText: 'Not found',
    data: 'Usuário não encontrado',
  },
};

class userStrategies extends customInterface {
  constructor() {
    super();
    this._index = 0;
    this._error = null;
  }

  /*
    Retorna a conexão com o google planilhas
  */
  async _getDocument() {
    /*
      Propriedade private_key com replace, para evitar problemas pois está no arquivo .env
    */
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

  /*
    Retorna as linhas da planilha
  */
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

  /*
    Retorna a planilha e seus métodos de manipulação
  */
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
    let user;
    const rows = await this._getRows();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].email_usuario.toLowerCase() === id.toString().toLowerCase()) {
        user = rows[i];
        break;
      }
    }
    return user;
  }

  _validateUser(user) {
    const error = [];
    const {
      nome_usuario, email_usuario, senha_usuario, telefone_usuario,
    } = user;
    if (!nome_usuario || nome_usuario.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'NOME',
        error: 'Campo não enviado ou vazio',
        value: nome_usuario || '',
      });
    }
    if (!senha_usuario || senha_usuario.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'SENHA',
        error: 'Campo não enviado ou vazio',
        value: senha_usuario || '',
      });
    } else if (senha_usuario.length < 8 || senha_usuario.length > 12) {
      error.push({
        field: 'SENHA',
        error: 'A senha deve ter de 8 a 12 caracteres',
        value: senha_usuario || '',
      });
    }
    /*
      Validando o formato de email através de regex
    */
    if (!email_usuario || !(/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email_usuario))) {
      error.push({
        field: 'EMAIL',
        error: 'Campo não enviado ou com formato inválido',
        value: email_usuario || '',
      });
    }
    /*
      Validanto que o telefone será de apenas 11 numeros, com regex
    */
    if (!telefone_usuario || !(/\d{11}/.test(telefone_usuario))) {
      error.push({
        field: 'TELEFONE',
        error: 'Campo não enviado ou com formato inválido',
        value: telefone_usuario || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return rows.map((user)=> (modelResponseUser(user)));
    } catch {
      return modelResponseError('Erro ao buscar todos os usuários ', this._error);
    }
  }

  async create(data) {
    try {
      const validate = this._validateUser(data);
      if (validate.length > 0) {
        return modelResponseError('Erro ao criar usuário', { ...handleError[401], data: validate });
      }
      if (await this._checkExist(data.email_usuario)) {
        return modelResponseError('Email já cadastrado', handleError[401]);
      }
      const sheet = await this._getSheet();
      return sheet.addRow({
        nome_usuario: data.nome_usuario,
        email_usuario: data.email_usuario,
        telefone_usuario: data.telefone_usuario,
        senha_usuario: data.senha_usuario,
        imagem_usuario: data.imagem_usuario || '',
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> modelResponseUser(res))
        .catch((error)=> {
          console.log('Houve um erro ao criar usuário', error);
          throw new Error();
        });
    } catch {
      return modelResponseError('Houve um erro ao criar usuário', this._error);
    }
  }

  async getById(id) {
    try {
      const user = await this._checkExist(id);
      if (user) {
        return modelResponseUser(user);
      }
      return modelResponseError('Erro ao buscar usuário', handleError[404]);
    } catch {
      return modelResponseError('Erro ao buscar usuário pelo ID', this._error);
    }
  }

  async update(id, data) {
    try {
      if (id && data) {
        const user = await this._checkExist(id);
        if (user) {
          user.nome_usuario = user.nome_usuario !== data.nome_usuario ? data.nome_usuario : user.nome_usuario;
          user.imagem_usuario = user.imagem_usuario !== data.imagem_usuario ? data.imagem_usuario : user.imagem_usuario;
          user.telefone_usuario = user.telefone_usuario !== data.telefone_usuario ? data.telefone_usuario : user.telefone_usuario;
          user._updatedAt = new Date().toLocaleString('pt-BR', { timeZone: 'UTC' });
          await user.save();
          return modelResponseUser(user);
        }
        return modelResponseError('Erro ao atualizar usuário', handleError[404]);
      }
      return modelResponseError('Erro ao atualizar usuário', { ...handleError[401], data: 'Favor enviar o id e os dados corretamente' });
    } catch {
      return modelResponseError('Erro ao atualizar usuário pelo ID', this._error);
    }
  }

  async delete(id) {
    try {
      const user = await this._checkExist(id);
      if (user) {
        const response = modelResponseUser(user);
        await user.del();
        return response;
      }
      return modelResponseError('Erro ao deletar usuário', handleError[404]);
    } catch {
      return modelResponseError('Erro ao deletar usuário pelo ID', this._error);
    }
  }
}

module.exports = userStrategies;
