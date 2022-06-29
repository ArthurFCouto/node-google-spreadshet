function routeNotFound(request, response) {
  const { url, method } = request;
  response.writeHead(404);
  return response.end(JSON.stringify({
    error: 'Rota inexistente',
    details: {
      status: 404,
      statusText: 'Not found',
      data: `O endereço ${url}, com o método ${method},não existe`,
    },
  }));
}

module.exports = routeNotFound;
