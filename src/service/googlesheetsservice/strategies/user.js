/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const customError = require('../../../util/error');
const { modelResponseUser, modelResponseError } = require('../../../util/modelsResponse');
const customInterface = require('./base/interface');

require('dotenv').config();

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

  _validateUser(data) {
    const error = [];
    if (typeof data !== 'object') {
      data = {};
    }
    const {
      nomeUsuario, emailUsuario, senhaUsuario, telefoneUsuario,
    } = data;
    if (!nomeUsuario || nomeUsuario.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'nomeUsuario',
        error: 'Campo não enviado ou vazio',
        value: nomeUsuario || '',
      });
    }
    if (!senhaUsuario || senhaUsuario.toString().replace(/\s/g, '').length === 0) {
      error.push({
        field: 'senhaUsuario',
        error: 'Campo não enviado ou vazio',
        value: senhaUsuario || '',
      });
    } else if (senhaUsuario.toString().length < 8 || senhaUsuario.toString().length > 12) {
      error.push({
        field: 'senhaUsuario',
        error: 'A senha deve ter de 8 a 12 caracteres',
        value: senhaUsuario || '',
      });
    }
    /*
      Validando o formato de email através de regex
    */
    if (!emailUsuario || !(/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(emailUsuario))) {
      error.push({
        field: 'emailUsuario',
        error: 'Campo não enviado ou com formato inválido',
        value: emailUsuario || '',
      });
    }
    /*
      Validanto que o telefone será de apenas 11 numeros, com regex
    */
    if (!telefoneUsuario || !(/^\d{11}$/.test(telefoneUsuario))) {
      error.push({
        field: 'telefoneUsuario',
        error: 'Campo não enviado ou com formato inválido',
        value: telefoneUsuario || '',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      return rows.map((user)=> (modelResponseUser(user)));
    } catch {
      return modelResponseError('Ops! Erro ao buscar usuários cadastrados', this._error);
    }
  }

  async create(data) {
    try {
      const validate = this._validateUser(data);
      if (validate.length > 0) {
        return modelResponseError('Ops! Não foi possível cadastrar o usuário', { ...customError[400], data: validate });
      }
      if (await this._checkExist(data.emailUsuario)) {
        return modelResponseError('Ops! Este email já cadastrado', customError[400]);
      }
      const sheet = await this._getSheet();
      return sheet.addRow({
        nome_usuario: data.nomeUsuario,
        email_usuario: data.emailUsuario,
        telefone_usuario: data.telefoneUsuario,
        senha_usuario: data.senhaUsuario,
        imagem_usuario: data.imagemUsuario || '',
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> modelResponseUser(res))
        .catch((error)=> {
          this._error = error;
          throw new Error();
        });
    } catch {
      return modelResponseError('Ops! Erro durante o cadastro do usuário', this._error);
    }
  }

  async getById(id) {
    try {
      const user = id && await this._checkExist(id);
      if (user) {
        return modelResponseUser(user);
      }
      return modelResponseError(`Ops! O usuário com email ${id} não está cadastrado`, customError[404]);
    } catch {
      return modelResponseError('Ops! Erro durante a pesquisa pelo email', customError[500]);
    }
  }

  async update(id, data) {
    try {
      if (id && data) {
        const user = await this._checkExist(id);
        if (user) {
          const { nomeUsuario, imagemUsuario, telefoneUsuario } = data;
          if ((nomeUsuario) && (imagemUsuario) && (telefoneUsuario)) {
            user.nome_usuario = user.nome_usuario !== nomeUsuario ? nomeUsuario : user.nome_usuario;
            user.imagem_usuario = user.imagem_usuario !== imagemUsuario ? imagemUsuario : user.imagem_usuario;
            user.telefone_usuario = user.telefone_usuario !== telefoneUsuario ? telefoneUsuario : user.telefone_usuario;
            user._updatedAt = new Date().toLocaleString('pt-BR', { timeZone: 'UTC' });
            await user.save();
            return modelResponseUser(user);
          }
          return modelResponseError('Ops! Não foi possível concluir a atualização', { ...customError[400], data: 'Enviar o email, telefone e imagem corretamente' });
        }
        return modelResponseError(`Ops! O usuário com email ${id} não está cadastrado`, customError[404]);
      }
      return modelResponseError('Ops! Erro ao atualizar o usuário', { ...customError[400], data: 'Enviar o email e os dados corretamente' });
    } catch {
      return modelResponseError('Ops! Erro durante a atualização do usuário', customError[500]);
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
      return modelResponseError(`Ops! O usuário com email ${id} não está cadastrado`, customError[404]);
    } catch {
      return modelResponseError('Ops! Erro durante a exclusão do usuário', customError[500]);
    }
  }
}

module.exports = userStrategies;
