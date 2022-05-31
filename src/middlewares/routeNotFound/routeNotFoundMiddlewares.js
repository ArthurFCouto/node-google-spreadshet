function routeNotFound(request, response) {
  response.writeHead(404);
  return response.end(JSON.stringify({
    error: 'Rota inexistente',
    details: {
      status: 404,
      statusText: 'Not found',
      data: `O endereço ${request.url}, com o método ${request.method} não existe`,
    },
  }));
}

module.exports = routeNotFound;
