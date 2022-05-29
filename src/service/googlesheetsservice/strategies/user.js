/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-plusplus */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const ws = require('../../../../worksheet.json');
const customInterface = require('./base/interface');
require('dotenv').config();

class userStrategies extends customInterface {
  async _getDocument() {
    // Propriedade private_key com replace, para evitar problemas pois está no arquivo .env
    const document = new GoogleSpreadsheet(ws.id);
    await document.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    await document.loadInfo();
    return document;
  }

  async _getRows() {
    return this._getDocument().then(async (response)=> {
      const sheet = response.sheetsByIndex[0];
      return sheet.getRows().then((rows)=> rows);
    })
      .catch((error)=> {
        console.log('Erro ao recuperar as linhas da planilha', error);
        throw new Error();
      });
  }

  async _getSheet() {
    return this._getDocument().then(async (response)=> response.sheetsByIndex[0])
      .catch((error)=> {
        console.log('Erro ao recuperar a planilha', error);
        throw new Error();
      });
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
        field: 'nome_usuario',
        error: 'Campo não enviado ou vazio',
      });
    }
    if (!senha_usuario || senha_usuario.replace(/\s/g, '').length === 0) {
      error.push({
        field: 'senha_usuario',
        error: 'Campo não enviado ou vazio',
      });
    } else if (senha_usuario.length < 8 || senha_usuario.length > 12) {
      error.push({
        field: 'senha_usuario',
        error: 'A senha deve ter de 8 a 12 caracteres',
      });
    }
    if (!email_usuario || !(/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email_usuario))) {
      error.push({
        field: 'email_usuario',
        error: 'Campo não enviado ou com formato inválido',
      });
    }
    if (!telefone_usuario || !(/\d{11}/.test(telefone_usuario))) {
      error.push({
        field: 'telefone_usuario',
        error: 'Campo não enviado ou com formato inválido',
      });
    }
    return error;
  }

  async getAll() {
    try {
      const rows = await this._getRows();
      const user = rows.map((row)=> ({
        id: 0,
        nome_usuario: row.nome_usuario,
        email_usuario: row.email_usuario,
        telefone_usuario: row.telefone_usuario,
        senha_usuario: row.senha_usuario,
        imagem_usuario: row.imagem_usuario,
      }));
      return user;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários ', error);
      return false;
    }
  }

  async create(data) {
    try {
      const validade = this._validateUser(data);
      if (validade.length > 0) {
        return validade;
      }
      if (await this._checkExist(data.email_usuario)) {
        return false;
      }
      const sheet = await this._getSheet();
      const user = await sheet.addRow({
        nome_usuario: data.nome_usuario,
        email_usuario: data.email_usuario,
        telefone_usuario: data.telefone_usuario,
        senha_usuario: data.senha_usuario,
        imagem_usuario: data.imagem_usuario || '',
        _createdAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
        _updatedAt: new Date().toLocaleString('pt-BR', { timeZone: 'UTC' }),
      })
        .then((res)=> (
          {
            id: 0,
            nome_usuario: res.nome_usuario,
            email_usuario: res.email_usuario,
            telefone_usuario: res.telefone_usuario,
            senha_usuario: res.senha_usuario,
            imagem_usuario: res.imagem_usuario,
          }
        ))
        .catch((error)=> {
          console.log('Houve um erro ao criar usuário', error);
          throw new Error();
        });
      return user;
    } catch (error) {
      return false;
    }
  }

  async getById(id) {
    try {
      const user = await this._checkExist(id);
      if (user) {
        const response = {
          id: 0,
          nome_usuario: user.nome_usuario,
          email_usuario: user.email_usuario,
          telefone_usuario: user.telefone_usuario,
          senha_usuario: user.senha_usuario,
          imagem_usuario: user.imagem_usuario,
        };
        return response;
      }
      return false;
    } catch (error) {
      console.error('Erro ao buscar usuário pelo ID', error);
      return false;
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
          const response = {
            id: 0,
            nome_usuario: user.nome_usuario,
            email_usuario: user.email_usuario,
            telefone_usuario: user.telefone_usuario,
            senha_usuario: user.senha_usuario,
            imagem_usuario: user.imagem_usuario,
          };
          return response;
        }
        return false;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar usuário ', error);
      return false;
    }
  }

  async delete(id) {
    try {
      const user = await this._checkExist(id);
      if (user) {
        const response = {
          id: 0,
          nome_usuario: user.nome_usuario,
          email_usuario: user.email_usuario,
          telefone_usuario: user.telefone_usuario,
          senha_usuario: user.senha_usuario,
          imagem_usuario: user.imagem_usuario,
        };
        await user.del();
        return response;
      }
      return false;
    } catch (error) {
      console.error('Erro ao deletar usuário', error);
      return false;
    }
  }
}

module.exports = userStrategies;
