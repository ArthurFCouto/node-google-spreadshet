const customError = {
  400: {
    status: 400,
    statusText: 'Bad request',
    data: 'Erro durante a requisição',
  },
  401: {
    status: 401,
    statusText: 'Unauthorized',
    data: 'Autenticação necessária',
  },
  403: {
    status: 403,
    statusText: 'Forbidden',
    data: 'Acesso não autorizado',
  },
  404: {
    status: 404,
    statusText: 'Not found',
    data: 'O recurso solicitado não existe',
  },
  500: {
    status: 500,
    statusText: 'Internal server error',
    data: 'Erro interno no servidor',
  },
};

module.exports = customError;
