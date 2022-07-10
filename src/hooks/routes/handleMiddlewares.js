const handleMiddlewares = async (request, response, callback)=> {
  const latestPosition = callback.length - 1;
  const middlewares = callback.slice(0, latestPosition);
  const middlewaresPending = middlewares.map(async (middleware)=> {
    if (response.completed) {
      return;
    }
    await middleware(request, response);
  });
  await Promise.all(middlewaresPending);
  if (response.completed) {
    return;
  }
  const controller = callback[latestPosition];
  controller(request, response);
};

module.exports = handleMiddlewares;
