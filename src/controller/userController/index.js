/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Context, User } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');
const { modelResponseError } = require('../../util/modelsResponse');

const createToken = (email, role)=> {
  const user = {
    email,
    role,
  };
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

class UserController {
  async getAll(request, response) {
    const context = new Context(new User());
    const data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    if (Array.isArray(data) && data.length > 0) {
      const users = data.map((item)=> ({
        ...item,
        senhaUsuario: '********',
      }));
      response.end(JSON.stringify(users));
      return;
    }
    response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.getById(email);
      if (data && data.error) {
        response.writeHead(data.details.status);
        response.end(JSON.stringify(data));
        return;
      }
      data.senhaUsuario = '********';
      response.end(JSON.stringify(data));
      return;
    }
    response.writeHead(404);
    response.end(JSON.stringify({
      error: 'Ops! Favor enviar o parametro email',
      details: customError[404],
    }));
  }

  async save(request, response) {
    const context = new Context(new User());
    const { body } = request;
    const data = await context.create(body);
    if (data && data.error) {
      response.writeHead(data.details.status);
      response.end(JSON.stringify(data));
      return;
    }
    response.end(JSON.stringify({
      usuario: {
        ...data,
        senhaUsuario: '********',
      },
      token: createToken(data.emailUsuario, data.roleUsuario),
    }));
  }

  async delete(request, response) {
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.delete(email);
      if (data && data.error) {
        response.writeHead(data.details.status);
        response.end(JSON.stringify(data));
        return;
      }
      data.senhaUsuario = '********';
      response.end(JSON.stringify(data));
      return;
    }
    response.writeHead(404);
    response.end(JSON.stringify({
      error: 'Ops! Favor enviar o parametro email',
      details: customError[404],
    }));
  }

  async login(request, response) {
    try {
      const { email, senha } = request.body;
      if (!email || !senha) {
        response.writeHead(400);
        response.end(JSON.stringify({
          error: 'Ops! Favor enviar os dados corretamente',
          details: {
            ...customError[400],
            data: 'Verificar os campos email e senha',
          },
        }));
        return;
      }
      const context = new Context(new User());
      const data = await context.getById(email);
      if (data && data.error) {
        response.writeHead(data.details.status);
        response.end(JSON.stringify(data));
        return;
      }
      if (await bcrypt.compare(senha, data.senhaUsuario)) {
        const {
          nomeUsuario, emailUsuario, roleUsuario,
        } = data;
        response.end(JSON.stringify({
          usuario: {
            emailUsuario,
            nomeUsuario,
          },
          token: createToken(emailUsuario, roleUsuario),
        }));
        return;
      }
      response.writeHead(400);
      response.end(JSON.stringify({
        error: 'Ops! Email ou senha incorretos',
        details: customError[400],
      }));
    } catch (error) {
      const errorResponse = modelResponseError('Ops! Erro durante a autenticação do usuário', error);
      response.writeHead(errorResponse.details.status);
      response.end(JSON.stringify(errorResponse));
    }
  }
}

module.exports = new UserController();
