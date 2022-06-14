const UserStrategies = require('./strategies/user');
const ProductStrategies = require('./strategies/product');
const Context = require('./strategies/base/context');

module.exports = {
  Context,
  User: UserStrategies,
  Product: ProductStrategies,
};
