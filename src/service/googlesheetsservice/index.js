const UserStrategies = require('./strategies/user');
const MarketStrategies = require('./strategies/market');
const ProductStrategies = require('./strategies/product');
const Context = require('./strategies/base/context');
const PriceStrategy = require('./strategies/price');

module.exports = {
  Context,
  User: UserStrategies,
  Product: ProductStrategies,
  Price: PriceStrategy,
  Market: MarketStrategies,
};
