const jwt = require('jsonwebtoken');
const { Context, User } = require('../../service/googlesheetsservice');
const { modelResponseError } = require('../../util/modelsResponse');

require('dotenv').config();

async function handleAuthMiddleware(request, response) {
  try {
    const { authorization } = request.headers;
    const user = {};
    if (authorization) {
      const context = new Context(new User());
      const [, token] = authorization.split(' ');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, role } = decoded;
      const userFull = await context.getById(email);
      if (userFull.id === 0) {
        user.email = email;
        user.role = role;
      }
    }
    request.user = user;
  } catch (error) {
    const errorResponse = modelResponseError('Ops! Houve um problema com seu token, favor repetir a operação', error);
    response.writeHead(errorResponse.details.status);
    response.end(JSON.stringify(errorResponse));
  }
}

module.exports = handleAuthMiddleware;
