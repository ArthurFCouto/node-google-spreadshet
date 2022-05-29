/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const { cosmos } = require('../server/config');

function modelResponseProduct(product, model) {
  if (Array.isArray(product) || Array.isArray(product.products)) {
    return modelResponseProductList(product, model);
  }
  if (model === 'cosmos') {
    const {
      description: descricaoProduto, gtin: codigoProduto, avg_price: precoMedioNacional, barcode_image: barcodeProduto, thumbnail: thumbnailProduto,
    } = product;
    const imagemProduto = thumbnailProduto || cosmos.urlDefault.imagem;
    return {
      id: 0,
      barcodeProduto,
      codigoProduto,
      descricaoProduto,
      imagemProduto,
      precoMedioNacional, // : precoMedioNacional.toFixed(2)
    };
  }
  const {
    descricao_produto: descricaoProduto, barcode_produto: barcodeProduto, imagem_produto: thumbnailProduto, preco_medio_nacional: precoMedioNacional, codigo_produto: codigoProduto,
    _createdAt: criadoEm, _updatedAt: atualizadoEm,
  } = product;
  const imagemProduto = thumbnailProduto || cosmos.urlDefault.imagem;
  return {
    id: 0,
    descricaoProduto,
    imagemProduto,
    barcodeProduto,
    precoMedioNacional: parseFloat(precoMedioNacional.replace(',', '.')).toFixed(2),
    codigoProduto,
  };
}

function modelResponseUser(user) {
  const {
    email_usuario, nome_usuario, imagem_usuario, senha_usuario, telefone_usuario,
  } = user;
  return {
    id: 0,
    email_usuario,
    nome_usuario,
    imagem_usuario,
    senha_usuario,
    telefone_usuario,
  };
}

function modelResponseError(message, error) {
  let response = {};
  if (error.response) {
    response = {
      error: message,
      details: {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data.message || error.response.data.error_description,
      },
    };
  } else if (error.request) {
    response = {
      error: message,
      details: {
        status: 500,
        statusText: 'Internal server error',
        data: error.request,
      },
    };
  } else if (error.status) {
    response = {
      error: message,
      details: {
        status: error.status,
        statusText: error.statusText,
        data: error.data,
      },
    };
  } else {
    response = {
      error: message,
      details: {
        status: 500,
        statusText: 'Internal server error',
        data: 'Erro interno no servidor, tente mais tarde',
      },
    };
  }
  return new Promise((resolve, reject)=> {
    reject(response);
  });
}

function modelResponseProductList(data, model) {
  if (model === 'cosmos') {
    const {
      current_page, per_page, total_pages, total_count, next_page, products,
    } = data;
    const list_products = products.map((item)=> modelResponseProduct(item, 'cosmos'));
    return {
      atualPagina: current_page,
      porPagina: per_page,
      totalPagina: total_pages,
      totalProduto: total_count,
      proximaPagina: next_page,
      listaProduto: list_products,
    };
  }
  const list_products = data.map((item)=> modelResponseProduct(item, 'sheet'));
  return {
    atualPagina: 1,
    porPagina: list_products.length,
    totalPagina: 1,
    totalProduto: list_products.length,
    proximaPagina: undefined,
    listaProduto: list_products,
  };
}

module.exports = {
  modelResponseProduct,
  modelResponseUser,
  modelResponseError,
};
