/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
const { cosmos } = require('../server/config');

function modelResponseProduct(product, model) {
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
      precoMedioNacional,
    };
  }
  const {
    id, barcodeProduto, codigoProduto, descricaoProduto, imagemProduto, precoMedioNacional,
  } = product;
  return {
    id,
    barcodeProduto,
    codigoProduto,
    descricaoProduto,
    imagemProduto,
    precoMedioNacional,
  };
}

function modelResponseUser(user) {
  const {
    id, email_usuario, nome_usuario, imagem_usuario, senha_usuario, telefone_usuario,
  } = user;
  return {
    id,
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
        data: error.response.data.message,
      },
    };
  }
  if (error.request) {
    response = {
      error: message,
      details: {
        status: undefined,
        statusText: undefined,
        data: error.request,
      },
    };
  }
  response = {
    error: message,
    details: {
      status: error.status,
      statusText: error.statusText,
      data: error.data,
    },
  };
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
  const list_products = data.map((item)=> modelResponseProduct(item, 'dato'));
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
  modelResponseProductList,
  modelResponseUser,
  modelResponseError,
};
