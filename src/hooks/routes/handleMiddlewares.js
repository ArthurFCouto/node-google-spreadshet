/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const handleMiddlewares = async (request, response, callback)=> {
  const latestPosition = callback.length - 1;
  const middlewares = callback.slice(0, latestPosition);
  /*
   * Está sendo utilizado for e não forEach pois este não aguarda a finalização das promisses
   * Como um middleware pode dependenter de um antecessor, não farei uso do Promise.all
   */
  for (const middleware of middlewares) {
    await middleware(request, response);
    if (response.finished) {
      break;
    }
  }
  if (response.finished) {
    return;
  }
  const controller = callback[latestPosition];
  return controller(request, response);
};

module.exports = handleMiddlewares;
