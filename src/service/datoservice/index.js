/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
const { SiteClient } = require('datocms-client');
const config = require('../../server/config');
const {
  modelResponseProduct, modelResponseUser, modelResponseError, modelResponseProductList,
} = require('../../util');

require('dotenv').config();

const fieldsProduct = {
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
}

class DatoService {
  constructor() {
    this.client = new SiteClient(process.env.TOKEN_DATOCMS);
  }

  async createProduct(data) {
    try {
      const product = await this.client.items.create({
        itemType: config.datoCMS.modelId.produto,
        descricao_produto: data.descricaoProduto,
        codigo_produto: data.codigoProduto.toString(),
        imagem_produto: data.imagemProduto,
        barcode_produto: data.barcodeProduto,
        preco_medio_nacional: data.precoMedioNacional || '0.00',
      });
      return modelResponseProduct(product, 'dato');
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro durante o cadastro do produto', handleError(error));
    }
  }

  async getProductByCode(code) {
    try {
      const product = await this.client.items.all(
        {
          filter: {
            type: 'produto',
            fields: {
              codigoProduto: {
                eq: code,
              },
            },
          },
        },
      );
      const [response] = product;
      return response ? modelResponseProduct(response, 'dato') : modelResponseError('Ops! Ocorreu um erro durante a pesquisa', handleError({ statusCode: 404, statusText: 'Not found' }));
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', handleError(error));
    }
  }

  async getProductByDescription(description) {
    try {
      const product = await this.client.items.all(
        {
          filter: {
            type: 'produto',
            fields: {
              descricaoProduto: {
                matches: {
                  pattern: description,
                },
              },
            },
          },
        },
        {
          allPages: true,
        },
      );
      return modelResponseProductList(product, 'dato');
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', handleError(error));
    }
  }

  async getAllProduct() {
    try {
      const product = await this.client.items.all(
        {
          filter: {
            type: 'produto',
          },
        },
        {
          allPages: true,
        },
      );
      return modelResponseProductList(product, 'dato');
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro durante a pesquisa', handleError(error));
    }
  }

  async createUser(data) {
    try {
      const user = await this.client.items.create({
        itemType: config.datoCMS.modelId.usuario,
        nome_usuario: data.name,
        email_usuario: data.email,
        telefone_usuario: data.telephone,
        senha_usuario: data.password,
      });
      return modelResponseUser(user);
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro durante a criação do usuário', handleError(error));
    }
  }

  async destroy(id) {
    try {
      const destroy = await this.client.item.destroy(id);
      return modelResponseProduct(destroy, 'dato');
    } catch (error) {
      return modelResponseError('Ops! Ocorreu um erro enquanto deletava', handleError(error));
    }
  }
}

module.exports = new DatoService();
