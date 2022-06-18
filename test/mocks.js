const USER = {
  nomeUsuario: 'Ingride Barbosa',
  emailUsuario: 'ingride@gmail.com',
  telefoneUsuario: '38999731482',
  senhaUsuario: '12345678',
  imagemUsuario: '',
};

const USER_EXPECTED = {
  id: 0,
  nomeUsuario: 'Ingride Barbosa',
  emailUsuario: 'ingride@gmail.com',
  telefoneUsuario: '38999731482',
  senhaUsuario: '********',
  imagemUsuario: '',
};

const USER_FOR_UPDATE = {
  nomeUsuario: 'Ingride',
  emailUsuario: 'ingridebarbosa@gmail.com',
  telefoneUsuario: '38998628103',
  senhaUsuario: '87654321',
  imagemUsuario: 'https://source.unsplash.com/640x640/?user',
};

const USER_AFTER_UPDATE = {
  id: 0,
  nomeUsuario: 'Ingride',
  emailUsuario: 'ingride@gmail.com',
  telefoneUsuario: '38998628103',
  senhaUsuario: '********',
  imagemUsuario: 'https://source.unsplash.com/640x640/?user',
};

const USER_LIST = [
  {
    id: 0,
    nomeUsuario: 'Arthur',
    emailUsuario: 'arthur@gmail.com',
    telefoneUsuario: '38999414205',
    senhaUsuario: '********',
    imagemUsuario: 'https://source.unsplash.com/640x640/?user',
  },
  {
    id: 0,
    nomeUsuario: 'Mariah',
    emailUsuario: 'mariah@gmail.com',
    telefoneUsuario: '38998628103',
    senhaUsuario: '********',
    imagemUsuario: 'https://source.unsplash.com/640x640/?user',
  },
  {
    id: 0,
    nomeUsuario: 'Ingride',
    emailUsuario: 'ingride@gmail.com',
    telefoneUsuario: '38998628103',
    senhaUsuario: '********',
    imagemUsuario: 'https://source.unsplash.com/640x640/?user',
  },
];

const USER_NOT_FOUND = {
  details: {
    data: 'O recurso solicitado não existe',
    status: 404,
    statusText: 'Not found',
  },
  error: 'Erro ao buscar usuário',
};

const PRODUCT_EXPECT = {
  id: 0,
  barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
  codigoProduto: 7891910000197,
  descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
  imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
  precoMedioNacional: 5.99,
  detalheProduto: 'Açúcares e produtos de confeitaria - Açúcares de cana ou de beterraba e sacarose quimicamente pura, no estado sólido. - Outros: - Outros',
  categoriaProduto: 'Açúcar / Substitutos do Açúcar (Não perecível)',
  marcaProduto: 'UNIAO',
  origem: 'COSMOS',
  atualizadoEm: '',
};

const PRODUCT_LIST = {
  atualPagina: 1,
  porPagina: 30,
  totalPagina: 4,
  totalProduto: 103,
  proximaPagina: 'https://api.cosmos.bluesoft.com.br/products?page=2&query=ACUCAR+REFINADO+UNIAO+1KGS',
  listaProduto: [],
};

const PRODUTCT_LIST_2 = {
  atualPagina: 2,
  porPagina: 30,
  totalPagina: 4,
  totalProduto: 103,
  proximaPagina: 'https://api.cosmos.bluesoft.com.br/products?page=3&query=ACUCAR+REFINADO+UNIAO+1KGS',
  listaProduto: [],
};

const PRODUCT_NOT_FOUND = {
  details: {
    data: 'O recurso solicitado não existe',
    status: 404,
    statusText: 'Not Found',
  },
  error: 'Ops! Ocorreu um erro durante a pesquisa',
};

const PRODUCT_EXPECT_GOOGLE = {
  id: 0,
  barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
  codigoProduto: '7891910000197',
  descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
  imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
  precoMedioNacional: '5.99',
  detalheProduto: 'Açúcares e produtos de confeitaria - Açúcares de cana ou de beterraba e sacarose quimicamente pura, no estado sólido. - Outros: - Outros',
  categoriaProduto: 'Açúcar / Substitutos do Açúcar (Não perecível)',
  marcaProduto: 'UNIAO',
  origem: 'GOOGLESPREADSHEET',
};

const PRODUTCT_LIST_GOOGLE = {
  atualPagina: 1,
  porPagina: 1,
  totalPagina: 1,
  totalProduto: 1,
  proximaPagina: undefined,
  listaProduto: [],
};

const PRICE_ACTUAL = {
  codigoProduto: '7891024134702',
  emailUsuario: 'arthur@gmail.com',
  precoAtual: 4.49,
  cnpjMercado: '06981180000116',
  atualizadoEm: '',
};

const PRICE_ACTUAL_EXPECTED = {
  codigoProduto: '7891024134702',
  emailUsuario: 'arthur@gmail.com',
  precoAtual: '4.49',
  cnpjMercado: '06981180000116',
  atualizadoEm: '',
};

const PRICE_ACTUAL_ALL = [{
  7891024134702: [{ ...PRICE_ACTUAL_EXPECTED }],
}];

const PRICE_NOT_FOUND = {
  details: {
    data: 'O recurso solicitado não existe',
    status: 404,
    statusText: 'Not found',
  },
  error: 'Ainda não há preços atuais cadastrados para o produto com código 7896080900827',
};

const MARKET = {
  nomeMercado: 'CEMIG MG',
  cnpjMercado: '06981180000116',
  enderecoMercado: 'Avenida Barbacena',
  numeroMercado: '1200',
  complementoMercado: '17º Andar Ala A1',
  cidadeMercado: 'Belo Horizonte - MG',
  cepMercado: '30190131',
  telefoneMercado: '38999999999',
};

const MARKET_EXPECTED = {
  id: 0,
  nomeMercado: 'CEMIG MG',
  cnpjMercado: '06981180000116',
  enderecoMercado: 'Avenida Barbacena 1200 17º Andar Ala A1',
  cidadeMercado: 'Belo Horizonte - MG',
  cepMercado: '30190131',
  telefoneMercado: '38999999999',
  atualizadoEm: '',
};

const MARKET_LIST_EXPECTED = [
  MARKET_EXPECTED,
];

module.exports = {
  USER,
  USER_EXPECTED,
  USER_FOR_UPDATE,
  USER_AFTER_UPDATE,
  USER_LIST,
  USER_NOT_FOUND,
  PRODUCT_EXPECT,
  PRODUCT_LIST,
  PRODUTCT_LIST_2,
  PRODUCT_NOT_FOUND,
  PRODUCT_EXPECT_GOOGLE,
  PRODUTCT_LIST_GOOGLE,
  PRICE_ACTUAL,
  PRICE_ACTUAL_EXPECTED,
  PRICE_ACTUAL_ALL,
  PRICE_NOT_FOUND,
  MARKET,
  MARKET_LIST_EXPECTED,
  MARKET_EXPECTED,
};
