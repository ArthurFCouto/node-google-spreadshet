/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const { cosmos } = require('../server/config');
const customError = require('./error');

function modelResponseProduct(product, model) {
  if (Array.isArray(product) || Array.isArray(product.products)) {
    return modelResponseProductList(product, model);
  }
  if (model === 'cosmos') {
    const {
      description: descricaoProduto,
      gtin: codigoProduto,
      avg_price: preco,
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
    const precoMedioNacional = preco === null ? '0.00' : preco;
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
  return {
    id: 0,
    descricaoProduto,
    barcodeProduto,
    imagemProduto: thumbnailProduto,
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
    const list_products = products.map((item)=> modelResponseProduct(item, model));
    const querySeparatorIndex = next_page.indexOf('?');
    const paramsRaw = querySeparatorIndex !== -1 && next_page.slice(querySeparatorIndex + 1, next_page.length);
    let params = {};
    if (paramsRaw) {
      const list = paramsRaw.split('&').map((item)=> {
        const [key, value] = item.split('=');
        return `"${key}" : "${value}"`;
      });
      params = JSON.parse(`{${list.join(',')}}`);
    }
    return {
      atualPagina: current_page,
      porPagina: per_page,
      totalPagina: total_pages,
      totalProduto: total_count,
      proximaPagina: params,
      listaProduto: list_products,
    };
  }
  const list_products = data.map((item)=> modelResponseProduct(item, model));
  return {
    atualPagina: 1,
    porPagina: list_products.length,
    totalPagina: 1,
    totalProduto: list_products.length,
    proximaPagina: {},
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
    role_usuario: roleUsuario,
  } = user;
  return {
    id: 0,
    emailUsuario,
    nomeUsuario,
    imagemUsuario,
    senhaUsuario,
    telefoneUsuario,
    roleUsuario,
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
  codes.forEach((code)=> {
    const list = JSON.stringify(data.filter((price)=> price.codigo_produto === code).map((price)=> modelResponsePrice(price)));
    const prices = JSON.parse(`{"${code}": ${list}}`);
    listPrices.push(prices);
  });
  return listPrices;
}

function modelResponseError(message, error) {
  message = message || 'Erro interno no servidor';
  const { response, request, status } = error;
  if (response) {
    return {
      error: message,
      details: {
        status: response.status,
        statusText: 'Internal server error',
        data: response.data,
      },
    };
  }
  if (request) {
    return {
      error: message,
      details: {
        ...customError[400],
        data: request,
      },
    };
  }
  if (status) {
    return {
      error: message,
      details: error,
    };
  }
  if (error) {
    return {
      error: message,
      details: {
        ...customError[500],
        data: error.message,
      },
    };
  }
  return {
    error: message,
    details: customError[500],
  };
}

module.exports = {
  modelResponseError,
  modelResponseMarket,
  modelResponsePrice,
  modelResponseProduct,
  modelResponseUser,
};
