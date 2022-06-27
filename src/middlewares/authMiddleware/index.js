/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { Context, User } = require('../../service/googlesheetsservice');
const customError = require('../../util/error');

require('dotenv').config();

async function handleAuthMiddleware(request, response) {
  const { authorization } = request.headers;
  const user = {};
  try {
    if (authorization) {
      const context = new Context(new User());
      const [, token] = authorization.split(' ');
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const existUser = await context.getById(decoded.email);
      if (existUser) {
        user.email = decoded.email;
        user.role = decoded.role;
      }
    }
    request.user = user;
  } catch {
    response.writeHead(400);
    return response.end(JSON.stringify({
      error: 'Ops! Houve um erro durante a autenticação',
      details: { ...customError[400], data: 'Verifique o token enviado' },
    }));
  }
}

module.exports = handleAuthMiddleware;
