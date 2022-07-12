/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { Context, Market } = require('../../service/googlesheetsservice');

async function responsePriceById(data) {
  const context = new Context(new Market());
  const [info] = data;
  const [listPrices] = Object.values(info);
  const listMarket = [];
  for (const price of listPrices) {
    const market = await context.getById(price.cnpjMercado);
    delete market.id;
    delete market.atualizadoEm;
    listMarket.push(market);
  }
  const response = listPrices.map((item, index)=> {
    delete item.cnpjMercado;
    return {
      ...item,
      mercado: listMarket[index],
    };
  });
  return response;
}

module.exports = {
  modelPriceById: responsePriceById,
};
