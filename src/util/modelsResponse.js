/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
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
      description: descricaoProduto,
      gtin: codigoProduto,
      avg_price: precoMedioNacional,
      barcode_image: barcodeProduto,
      thumbnail: thumbnailProduto,
      ncm,
      origin: origem,
      brand,
      gpc,
      updated_at,
    } = product;
    const imagemProduto = thumbnailProduto || cosmos.urlDefault.imagem;
    const detalheProduto = ncm ? ncm.full_description : '';
    const marcaProduto = brand ? brand.name : '';
    const categoriaProduto = gpc ? gpc.description : '';
    return {
      id: 0,
      descricaoProduto,
      barcodeProduto,
      imagemProduto,
      detalheProduto,
      precoMedioNacional,
      marcaProduto,
      categoriaProduto,
      codigoProduto,
      atualizadoEm: updated_at,
      origem,
    };
  }
  const {
    descricao_produto: descricaoProduto,
    barcode_produto: barcodeProduto,
    imagem_produto: thumbnailProduto,
    detalhe_produto: detalheProduto,
    preco_medio_nacional: precoMedioNacional,
    codigo_produto: codigoProduto,
    marca_produto: marcaProduto,
    categoria_produto: categoriaProduto,
    _createdAt: criadoEm,
    _updatedAt: atualizadoEm,
  } = product;
  const imagemProduto = thumbnailProduto || cosmos.urlDefault.imagem;
  return {
    id: 0,
    descricaoProduto,
    barcodeProduto,
    imagemProduto,
    detalheProduto,
    precoMedioNacional: parseFloat(precoMedioNacional.replace(',', '.')).toFixed(2),
    marcaProduto,
    categoriaProduto,
    codigoProduto,
    atualizadoEm,
    origem: 'GOOGLESPREADSHEET',
  };
}

function modelResponseProductList(data, model) {
  if (model === 'cosmos') {
    const {
      current_page,
      per_page,
      total_pages,
      total_count,
      next_page,
      products,
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

function modelResponseUser(user) {
  const {
    email_usuario: emailUsuario,
    nome_usuario: nomeUsuario,
    imagem_usuario: imagemUsuario,
    senha_usuario: senhaUsuario,
    telefone_usuario: telefoneUsuario,
  } = user;
  return {
    id: 0,
    emailUsuario,
    nomeUsuario,
    imagemUsuario,
    senhaUsuario: '********',
    telefoneUsuario,
  };
}

function modelResponseMarket(market) {
  const {
    cnpj_mercado: cnpjMercado,
    nome_mercado: nomeMercado,
    endereco_mercado: enderecoMercado,
    numero_mercado: numeroMercado,
    complemento_mercado: complementoMercado,
    telefone_mercado: telefoneMercado,
    cidade_mercado: cidadeMercado,
    cep_mercado: cepMercado,
    _updatedAt: atualizadoEm,
  } = market;
  return {
    id: 0,
    cnpjMercado,
    nomeMercado,
    enderecoMercado: `${`${enderecoMercado} `}${`${numeroMercado} `}${complementoMercado}`,
    cidadeMercado,
    cepMercado,
    telefoneMercado,
    atualizadoEm,
  };
}

function modelResponsePrice(data) {
  if (data && Array.isArray(data)) {
    return modelResponsePriceList(data);
  }
  const {
    codigo_produto, preco_produto, email_usuario, cnpj_mercado, _updatedAt,
  } = data;
  return {
    codigoProduto: codigo_produto,
    precoAtual: parseFloat(preco_produto.replace(',', '.')).toFixed(2),
    cnpjMercado: cnpj_mercado.toString(),
    emailUsuario: email_usuario,
    atualizadoEm: _updatedAt,
  };
}

function modelResponsePriceList(data) {
  const codes = [...new Set(data.map((price)=> price.codigo_produto))];
  const listPrices = [];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const list = JSON.stringify(data.filter((price)=> price.codigo_produto === code).map((price)=> modelResponsePrice(price)));
    const index = JSON.parse(`{"${code}": ${list}}`);
    listPrices.push(index);
  }
  return listPrices;
}

/*
  Estudar a melhor forma de melhorar este método
*/
function modelResponseError(message, error) {
  message = message || 'Erro interno';
  let res = {};
  if (error === null) {
    res = {
      error: message,
      details: {
        status: 500,
        statusText: 'Internal server error',
        data: 'Erro interno no servidor, tente mais tarde',
      },
    };
  } else {
    const { response, request, status } = error;
    if (response) {
      res = {
        error: message,
        details: {
          status: response.status,
          statusText: response.statusText,
          data: response.data.message || error.response.data.error_description,
        },
      };
    } else if (request) {
      res = {
        error: message,
        details: {
          status: 500,
          statusText: 'Internal server error',
          data: request,
        },
      };
    } else if (status) {
      res = {
        error: message,
        details: {
          status,
          statusText: error.statusText,
          data: error.data,
        },
      };
    }
  }
  return new Promise((resolve, reject)=> {
    reject(res);
  });
}

module.exports = {
  modelResponseError,
  modelResponseMarket,
  modelResponsePrice,
  modelResponseProduct,
  modelResponseUser,
};
