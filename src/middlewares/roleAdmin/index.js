const { modelResponseError } = require('../../util/modelsResponse');
const customError = require('../../util/error');
const config = require('../../server/config');

const { roles } = config;

async function handleRoleAdmin(request, response) {
  try {
    const { role } = request.user;
    if (role !== roles.admin) {
      response.writeHead(403);
      response.end(JSON.stringify({
        error: 'Ops! Usuário sem autorização',
        details: customError[403],
      }));
    }
  } catch (error) {
    const errorResponse = modelResponseError('Ops! Houve um problema com sua autorização', error);
    response.writeHead(errorResponse.details.status);
    response.end(JSON.stringify(errorResponse));
  }
}

module.exports = handleRoleAdmin;
