const UserStrategies = require('./strategies/user');
const ProductStrategies = require('./strategies/product');
const Context = require('./strategies/base/context');

/* const fieldsProduct = {
  descricao_produto: 'description',
  codigo_produto: 'lins',
  imagem_produto: 'image',
  barcode_produto: 'barcode',
  preco_medio_nacional: 'average price',
};

const fieldsUser = {
  nome_usuario: 'name',
  email_usuario: 'email',
  telefone_usuario: 'telephone',
  senha_usuario: 'password',
};

function handleError(error) {
  if (error && error.statusCode) {
    if (error.statusCode === 422) {
      const { data } = error.body;
      const fields = data.map((field)=> {
        if (field.attributes.details.code === 'INVALID_FORMAT') {
          return {
            code: field.attributes.details.code,
            value: field.attributes.details.failing_value,
            message: field.attributes.details.message,
          };
        }
        return {
          code: field.attributes.details.code,
          value: fieldsProduct[field.attributes.details.field] || fieldsUser[field.attributes.details.field],
          message: field.attributes.details.code,
        };
      });
      return {
        data: fields,
        status: error.statusCode,
        statusText: error.statusText,
      };
    }
    const errorMessage = {
      401: 'Não autorizado',
      404: 'O recurso solicitado não existe',
    };
    return {
      data: errorMessage[error.statusCode],
      status: error.statusCode,
      statusText: error.statusText,
    };
  }
  console.log('Erro não mapeado: ', error);
  return {
    data: 'Houve um erro interno no sistema',
    status: 500,
    statusText: 'Internal server error',
  };
} */

module.exports = {
  Context,
  User: UserStrategies,
  Product: ProductStrategies,
};
