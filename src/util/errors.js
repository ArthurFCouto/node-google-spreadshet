function createError(message, status) {
  const statusText = {
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  const code = status || 500;
  return {
    status: code,
    statusText: statusText[code],
    data: message,
  };
}

module.exports = {
  createError,
};
