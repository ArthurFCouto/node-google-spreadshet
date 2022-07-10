const assert = require('assert');
const cosmosService = require('../src/service/cosmosservice');
const {
  Context, User, Product, Price, Market,
} = require('../src/service/googlesheetsservice');
const {
  USER,
  USER_FOR_UPDATE,
  USER_LIST,
  PRODUCT_EXPECT,
  PRODUCT_KEYS_LIST,
  PRICE_ACTUAL,
  MARKET,
  MARKET_EXPECTED,
  PRICE_ERROR,
  USER_ERROR,
  NOT_FOUND,
  MARKET_ERROR,
  PRODUCT_ERROR,
  BAD_REQUEST,
} = require('./mocks');

describe('Cosmos Service', function () {
  this.timeout(10000);
  const page = 2;
  const query = 'ACUCAR+REFINADO+UNIAO+1KG';

  it('Verificando a validação para a busca por código na api Cosmos', async ()=> {
    const result = await cosmosService.geBytLins();
    const expected = {
      ...BAD_REQUEST,
      error: 'Ops! Código com formato inválido',
    };
    assert.deepEqual(result, expected);
  });

  it('Busca um produto na api Cosmos pelo código', async ()=> {
    const result = await cosmosService.geBytLins(PRODUCT_EXPECT.codigoProduto);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    assert.deepEqual(compare, PRODUCT_EXPECT);
  });

  it('Verificando a validação para a busca pela descrição na api Cosmos', async ()=> {
    const result = await cosmosService.getByDescription();
    const expected = {
      ...BAD_REQUEST,
      error: 'Ops! Descrição não enviada ou com formato inválido',
    };
    assert.deepEqual(result, expected);
  });

  it('Busca uma lista na api Cosmos pela descrição', async ()=> {
    const result = await cosmosService.getByDescription(PRODUCT_EXPECT.descricaoProduto);
    const compare = Object.keys(result);
    assert.deepEqual(Array.isArray(result.listaProduto), true);
    assert.deepEqual(compare, PRODUCT_KEYS_LIST);
  });

  it('Busca a segunda página da lista retornada pela api Cosmos', async ()=> {
    const result = await cosmosService.getByNextPage(page, query);
    const compare = Object.keys(result);
    assert.deepEqual(Array.isArray(result.listaProduto), true);
    assert.deepEqual(result.atualPagina, page);
    assert.deepEqual(compare, PRODUCT_KEYS_LIST);
  });

  it('Verificando se retorna um erro default de NOT_FOUND da api Cosmos', async ()=> {
    const result = await cosmosService.geBytLins(0);
    const expected = {
      ...NOT_FOUND,
      error: 'Ops! Ocorreu um erro durante a pesquisa',
    };
    assert.deepEqual(result, expected);
  });
});

describe('Testando o design strategies - Usuários', function () {
  this.timeout(20000);
  const context = new Context(new User());
  const senhaUsuario = '********';

  it('Verificando as validações de cadastro de usuário', async ()=> {
    const result = await context.create({});
    assert.deepEqual(result, USER_ERROR);
  });

  it('Verificando o método de cadastro de usuários', async ()=> {
    const result = await context.create(USER);
    const compare = { ...result, senhaUsuario };
    const expected = { ...USER, senhaUsuario };
    assert.deepEqual(compare, expected);
  });

  it('Atualizando um usuário pelo email', async ()=> {
    const result = await context.update(USER.emailUsuario, USER_FOR_UPDATE);
    const compare = { ...result, senhaUsuario };
    const expected = { ...USER_FOR_UPDATE, senhaUsuario };
    assert.deepEqual(compare, expected);
  });

  it('Buscando todos os usuários cadastrados', async ()=> {
    const result = await context.getAll();
    const user = result[0];
    const compare = { ...user, senhaUsuario };
    const expected = { ...USER_LIST[0], senhaUsuario };
    assert.deepEqual(compare, expected);
  });

  it('Verificando o método de exclusão de usuário', async ()=> {
    const result = await context.delete(USER_FOR_UPDATE.emailUsuario);
    const compare = { ...result, senhaUsuario };
    const expected = { ...USER_FOR_UPDATE, senhaUsuario };
    assert.deepEqual(compare, expected);
  });

  it('Verificando se retorna um erro default', async ()=> {
    const email = USER_FOR_UPDATE.emailUsuario;
    const result = await context.getById(email);
    const expected = {
      ...NOT_FOUND,
      error: `Ops! O usuário com email ${email} não está cadastrado`,
    };
    assert.deepEqual(result, expected);
  });

  it('Buscando um usuário pelo e-mail', async ()=> {
    const result = await context.getById(USER_LIST[0].emailUsuario);
    const compare = { ...result, senhaUsuario };
    const expected = { ...USER_LIST[0], senhaUsuario };
    assert.deepEqual(compare, expected);
  });
});

describe('Testando o design strategies - Produtos', function () {
  this.timeout(20000);
  const context = new Context(new Product());
  const origemGoogle = 'GOOGLESPREADSHEET';
  const description = 'refinado';

  it('Verifica o método delete na API planilhas', async ()=> {
    const result = await context.delete(PRODUCT_EXPECT.codigoProduto);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    const expected = {
      ...PRODUCT_EXPECT,
      origem: origemGoogle,
    };
    assert.deepEqual(compare, expected);
  });

  it('Verifica as validações de cadastro do produto na API planilhas', async ()=> {
    const result = await context.create();
    assert.deepEqual(result, PRODUCT_ERROR);
  });

  it('Verificando o método de cadastro de produtos na API planilhas', async ()=> {
    const result = await context.create(PRODUCT_EXPECT);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    const expected = {
      ...PRODUCT_EXPECT,
      origem: origemGoogle,
    };
    assert.deepEqual(compare, expected);
  });

  it('Busca um produto na API planilhas pelo códigio', async ()=> {
    const result = await context.getById(PRODUCT_EXPECT.codigoProduto);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    const expected = {
      ...PRODUCT_EXPECT,
      origem: origemGoogle,
    };
    assert.deepEqual(compare, expected);
  });

  it('Busca todos os produtos da API planilhas', async ()=> {
    const result = await context.getAll();
    const compare = Object.keys(result);
    assert.deepEqual(Array.isArray(result.listaProduto), true);
    assert.deepEqual(compare, PRODUCT_KEYS_LIST);
  });

  it('Verifica as validações de busca pela descrição na API planilhas', async ()=> {
    const result = await context.getByDescription();
    const compare = Object.keys(result);
    assert.deepEqual(compare, PRODUCT_KEYS_LIST);
    const length = Array.isArray(result.listaProduto) && result.listaProduto.length;
    assert.deepEqual(length, 0);
  });

  it('Busca um produto na API planilhas pela descrição', async ()=> {
    const result = await context.getByDescription(description);
    const compare = Object.keys(result);
    assert.deepEqual(Array.isArray(result.listaProduto), true);
    assert.deepEqual(compare, PRODUCT_KEYS_LIST);
  });

  it('Verificando se retorna um erro default de NOT_FOUND da API planilhas', async ()=> {
    const code = 0;
    const result = await context.getById(code);
    const expected = {
      ...NOT_FOUND,
      error: `Ops! O produto com código ${code} não está cadastrado`,
    };
    assert.deepEqual(result, expected);
  });
});

describe('Testando o design strategies - Preços', function () {
  this.timeout(20000);
  const context = new Context(new Price());
  const precoAtual = '6.25';
  const atualizadoEm = '';
  const codigoProduto = '7891024134702';

  it('Verifica o método de validação do cadastro de preços', async ()=> {
    const result = await context.create({});
    assert.deepEqual(result, PRICE_ERROR);
  });

  it('Verifica o método de cadastro de preços', async ()=> {
    const result = await context.create(PRICE_ACTUAL);
    const compare = { ...result, atualizadoEm };
    assert.deepEqual(compare, PRICE_ACTUAL);
  });

  it('Busca todos os preços cadastrados', async ()=> {
    const result = await context.getAll();
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    const compare = { ...price[0], atualizadoEm };
    assert.deepEqual(compare, PRICE_ACTUAL);
  });

  it('Verifica se um preço cadastrado é atualizado', async ()=> {
    const result = await context.create({ ...PRICE_ACTUAL, precoAtual });
    const compare = { ...result, atualizadoEm };
    const expected = { ...PRICE_ACTUAL, precoAtual };
    assert.deepEqual(compare, expected);
  });

  it('Busca todos os preços cadastrados para um código de produto', async ()=> {
    const result = await context.getById(PRICE_ACTUAL.codigoProduto);
    const expected = result[0];
    const price = expected[codigoProduto];
    const compare = { ...price[0], atualizadoEm };
    assert.deepEqual(compare, { ...PRICE_ACTUAL, precoAtual });
  });

  it('Deleta todos os preços para um produto cadastrado', async ()=> {
    const result = await context.delete(PRICE_ACTUAL.codigoProduto);
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    const compare = { ...price[0], atualizadoEm };
    assert.deepEqual(compare, { ...PRICE_ACTUAL, precoAtual });
  });

  it('Verifica se retorna um erro default de NOT_FOUND', async ()=> {
    const result = await context.getById(PRICE_ACTUAL.codigoProduto);
    const expected = {
      ...NOT_FOUND,
      error: 'Ops! Ainda não há preços atuais cadastrados para o produto com código 7891024134702',
    };
    assert.deepEqual(result, expected);
  });
});

describe('Testando o design strategies - Mercado', function () {
  this.timeout(20000);
  const context = new Context(new Market());

  it('Verificando o método delete', async ()=> {
    const result = await context.delete(MARKET.cnpjMercado);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    assert.deepEqual(compare, MARKET_EXPECTED);
  });

  it('Verificando se retorna um erro default de NOT_FOUND', async ()=> {
    const cnpj = MARKET.cnpjMercado;
    const result = await context.getById(cnpj);
    const expected = {
      ...NOT_FOUND,
      error: `Ops! O mercado com CNPJ ${cnpj} não está cadastrado`,
    };
    assert.deepEqual(result, expected);
  });

  it('Verificando o método de validação do cadastro de mercado', async ()=> {
    const result = await context.create({});
    assert.deepEqual(result, MARKET_ERROR);
  });

  it('Verificando o método de cadastro de mercado', async ()=> {
    const result = await context.create(MARKET);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    assert.deepEqual(compare, MARKET_EXPECTED);
  });

  it('Buscando um mercado pelo CNPJ', async ()=> {
    const result = await context.getById(MARKET.cnpjMercado);
    const compare = {
      ...result,
      atualizadoEm: '',
    };
    assert.deepEqual(compare, MARKET_EXPECTED);
  });

  it('Buscando todos os mercados cadastrados', async ()=> {
    const result = await context.getAll();
    const compare = {
      ...result[0],
      atualizadoEm: '',
    };
    assert.deepEqual(compare, MARKET_EXPECTED);
  });
});
