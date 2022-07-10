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
<<<<<<< HEAD
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
=======
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const data = await context.getById(decoded.email).catch((error)=> error);
      if (data.id === 0) {
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
>>>>>>> 8ece582c4426ce27639280fd6de0406817af918c
  }
}

module.exports = handleAuthMiddleware;
