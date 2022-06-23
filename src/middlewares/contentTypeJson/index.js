function handleContentTypeJson(request, response) {
  response.setHeader('Content-Type', 'application/json');
}

module.exports = handleContentTypeJson;
