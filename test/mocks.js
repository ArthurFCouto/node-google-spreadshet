const USER = {
  nome_usuario: 'Ingride Barbosa',
  email_usuario: 'ingride@gmail.com',
  telefone_usuario: '38999731482',
  senha_usuario: '12345678',
  imagem_usuario: '',
};

const USER_EXPECTED = {
  id: 0,
  nome_usuario: 'Ingride Barbosa',
  email_usuario: 'ingride@gmail.com',
  telefone_usuario: '38999731482',
  senha_usuario: '********',
  imagem_usuario: '',
};

const USER_FOR_UPDATE = {
  nome_usuario: 'Ingride',
  email_usuario: 'ingridebarbosa@gmail.com',
  telefone_usuario: '38998628103',
  senha_usuario: '87654321',
  imagem_usuario: 'https://source.unsplash.com/640x640/?user',
};

const USER_AFTER_UPDATE = {
  id: 0,
  nome_usuario: 'Ingride',
  email_usuario: 'ingride@gmail.com',
  telefone_usuario: '38998628103',
  senha_usuario: '********',
  imagem_usuario: 'https://source.unsplash.com/640x640/?user',
};

const USER_LIST = [
  {
    id: 0,
    nome_usuario: 'Arthur',
    email_usuario: 'arthur@gmail.com',
    telefone_usuario: '38999414205',
    senha_usuario: '********',
    imagem_usuario: 'https://source.unsplash.com/640x640/?user',
  },
  {
    id: 0,
    nome_usuario: 'Mariah',
    email_usuario: 'mariah@gmail.com',
    telefone_usuario: '38998628103',
    senha_usuario: '********',
    imagem_usuario: 'https://source.unsplash.com/640x640/?user',
  },
  {
    id: 0,
    nome_usuario: 'Ingride',
    email_usuario: 'ingride@gmail.com',
    telefone_usuario: '38998628103',
    senha_usuario: '********',
    imagem_usuario: 'https://source.unsplash.com/640x640/?user',
  },
];

const USER_NOT_FOUND = {
  details: {
    data: 'Usuário não encontrado',
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
  origem: 'COSMOS',
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
  codigoProduto: 7891910000197,
  descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
  imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
  precoMedioNacional: 5.99,
  detalheProduto: 'Açúcares e produtos de confeitaria - Açúcares de cana ou de beterraba e sacarose quimicamente pura, no estado sólido. - Outros: - Outros',
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
};
