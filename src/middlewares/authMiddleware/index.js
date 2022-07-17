const jwt = require('jsonwebtoken');
const { Context, User } = require('../../service/googlesheetsservice');
const { modelResponseError } = require('../../util/modelsResponse');
const customError = require('../../util/error');

require('dotenv').config();

async function handleAuthMiddleware(request, response) {
  try {
    const { authorization } = request.headers;
    if (authorization) {
      const user = {};
      const context = new Context(new User());
      const [, token] = authorization.split(' ');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, role } = decoded;
      const userFull = await context.getById(email);
      if (userFull.id === 0) {
        user.email = email;
        user.role = role;
      }
      request.user = user;
    } else {
      response.writeHead(401);
      response.end(JSON.stringify({
        error: 'Ops! Usuário não autenticado',
        details: customError[401],
      }));
    }
  } catch (error) {
    const errorResponse = modelResponseError('Ops! Houve um problema com seu token', error);
    response.writeHead(errorResponse.details.status);
    response.end(JSON.stringify(errorResponse));
  }
}

module.exports = handleAuthMiddleware;
