/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Context, User } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');
const { modelResponseError } = require('../../util/modelsResponse');
const config = require('../../server/config');

const { roles } = config;

class UserController {
  async getAll(request, response) {
    const { role } = request.user;
    if (!role) {
      response.writeHead(401);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
    if (role !== roles.admin) {
      response.writeHead(403);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário sem autorização para a operação',
        details: customError[403],
      }));
    }
    const context = new Context(new User());
    let data = await context.getAll();
    if (data && data.error) {
      response.writeHead(data.details.status);
    }
    if (Array.isArray(data) && data.length > 0) {
      data = data.map((item)=> ({ ...item, senhaUsuario: '********' }));
    }
    return response.end(JSON.stringify(data));
  }

  async getById(request, response) {
    const { role } = request.user;
    if (!role) {
      response.writeHead(401);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
    if (role !== roles.admin) {
      response.writeHead(403);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário sem autorização para a operação',
        details: customError[403],
      }));
    }
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.getById(email);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      if (data.id === 0) {
        data.senhaUsuario = '********';
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um usuario com os dados enviados',
      details: customError[404],
    }));
  }

  async save(request, response) {
    const context = new Context(new User());
    const { body } = request;
    const data = await context.create(body);
    if (data && data.error) {
      response.writeHead(data.details.status);
      return response.end(JSON.stringify(data));
    }
    return response.end(JSON.stringify({
      usuario: { ...data, senhaUsuario: '********' },
      token: jwt.sign({ email: data.emailUsuario, role: data.roleUsuario }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
      }),
    }));
  }

  async delete(request, response) {
    const { role } = request.user;
    if (!role) {
      response.writeHead(401);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
    if (role !== roles.admin) {
      response.writeHead(403);
      return response.end(JSON.stringify({
        error: 'Ops! Usuário sem autorização para a operação',
        details: customError[403],
      }));
    }
    const context = new Context(new User());
    const { email } = request.params;
    if (email) {
      const data = await context.delete(email);
      if (data && data.error) {
        response.writeHead(data.details.status);
      }
      if (data.id === 0) {
        data.senhaUsuario = '********';
      }
      return response.end(JSON.stringify(data));
    }
    response.writeHead(404);
    return response.end(JSON.stringify({
      error: 'Ops! Não foi encontrado um usuario com os dados enviados',
      details: customError[404],
    }));
  }

  async login(request, response) {
    const { email, senha } = request.body;
    if (!email || !senha) {
      response.writeHead(400);
      return response.end(JSON.stringify({
        error: 'Ops! Favor enviar os dados corretamente',
        details: { ...customError[400], data: 'Verificar os campos email e senha' },
      }));
    }
    try {
      const context = new Context(new User());
      const user = await context.getById(email);
      if (!user.error) {
        if (await bcrypt.compare(senha, user.senhaUsuario)) {
          const {
            nomeUsuario, emailUsuario, roleUsuario,
          } = user;
          return response.end(JSON.stringify({
            usuario: {
              emailUsuario,
              nomeUsuario,
            },
            token: jwt.sign({ email: emailUsuario, role: roleUsuario }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRESIN,
            }),
          }));
        }
        response.writeHead(400);
        return response.end(JSON.stringify({
          error: 'Ops! Senha ou email incorretos',
          details: customError[400],
        }));
      }
      response.writeHead(user.details.status || 500);
      response.end(JSON.stringify({ user }));
    } catch (error) {
      const errorResponse = modelResponseError('Ops! Erro durante a autenticação do usuário', error);
      response.writeHead(errorResponse.details.status);
      response.end(JSON.stringify(errorResponse));
    }
  }
}

module.exports = new UserController();
