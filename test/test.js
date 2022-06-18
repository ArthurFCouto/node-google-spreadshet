/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert');
const cosmosService = require('../src/service/cosmosservice');
const {
  Context, User, Product, Price, Market,
} = require('../src/service/googlesheetsservice');
const {
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
  PRICE_ACTUAL_ALL,
  PRICE_ACTUAL_EXPECTED,
  MARKET,
  MARKET_EXPECTED,
} = require('./mocks');

describe('Cosmos Service', function () {
  this.timeout(10000);

  it('Busca um produto na api Cosmos pelo código', async ()=> {
    const result = await cosmosService.geBytLins(PRODUCT_EXPECT.codigoProduto).catch((erro)=> erro);
    assert.deepEqual({ ...result, atualizadoEm: '' }, PRODUCT_EXPECT);
  });

  it('Busca uma lista na api Cosmos pela descrição', async ()=> {
    const result = await cosmosService.getByDescription(PRODUCT_EXPECT.descricaoProduto).catch((erro)=> erro);
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, PRODUCT_LIST);
  });

  it('Busca a segunda página da lista retornada pela api Cosmos', async ()=> {
    const result = await cosmosService.getByNextPage(PRODUCT_LIST.proximaPagina).catch((erro)=> erro);
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, PRODUTCT_LIST_2);
  });

  it('Verificando se retorna um erro default', async ()=> {
    const result = await cosmosService.geBytLins(0).catch((erro)=> erro);
    assert.deepEqual(result, PRODUCT_NOT_FOUND);
  });
});

describe('Testando o design strategies - Usuários', ()=> {
  it('Criando um usuário na API planilha', async ()=> {
    const context = new Context(new User());
    const result = await context.create(USER).catch((error)=> error);
    assert.deepEqual(result, USER_EXPECTED);
  }).timeout(10000);

  it('Atualizando um usuário pelo email na API planilha', async ()=> {
    const context = new Context(new User());
    const result = await context.update(USER.emailUsuario, USER_FOR_UPDATE).catch((error)=> error);
    assert.deepEqual(result, USER_AFTER_UPDATE);
  }).timeout(10000);

  it('Buscando todos os usuários da API planilhas', async ()=> {
    const context = new Context(new User());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result, USER_LIST);
  }).timeout(10000);

  it('Excluindo um usuário pelo email', async ()=> {
    const context = new Context(new User());
    const result = await context.delete(USER.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, USER_AFTER_UPDATE);
  }).timeout(10000);

  it('Verificando se retorna um erro default', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, USER_NOT_FOUND);
  }).timeout(10000);

  it('Buscando um usuário pelo e-mail', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER_LIST[0].emailUsuario).catch((error)=> error);
    assert.deepEqual(result, USER_LIST[0]);
  }).timeout(10000);
});

describe('Testando o design strategies - Produtos', ()=> {
  it('Cria um produto na API planilhas pelo código', async ()=> {
    const context = new Context(new Product());
    const result = await context.create(PRODUCT_EXPECT_GOOGLE).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, PRODUCT_EXPECT_GOOGLE);
  }).timeout(10000);

  it('Busca todos os produtos na API planilhas', async ()=> {
    const context = new Context(new Product());
    const result = await context.getAll().catch(((erro)=> erro));
    assert.deepEqual({
      ...result,
      listaProduto: [],
    }, {
      ...PRODUTCT_LIST_GOOGLE,
      listaProduto: [],
      proximaPagina: undefined,
    });
  }).timeout(10000);

  it('Apaga um produto na API planilhas pelo código', async ()=> {
    const context = new Context(new Product());
    const result = await context.delete(PRODUCT_EXPECT_GOOGLE.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, PRODUCT_EXPECT_GOOGLE);
  }).timeout(10000);

  it('Busca um produto na API planilhas pela descrição', async ()=> {
    const context = new Context(new Product());
    const result = await context.getByDescription('refinado').catch(((erro)=> erro));
    assert.deepEqual({
      ...result,
      listaProduto: [],
    }, {
      ...PRODUTCT_LIST_GOOGLE,
      porPagina: 0,
      totalProduto: 0,
    });
  }).timeout(10000);
});

/*
  Ainda trabalhando na melhor forma de modelar as respostas para estes métodos
*/
describe('Testando o design strategies - Preços', function () {
  this.timeout(10000);

  it('Cria um preço na API planilhas', async ()=> {
    const context = new Context(new Price());
    const result = await context.create(PRICE_ACTUAL).catch(((erro)=> erro));
    assert.deepEqual(
      {
        ...result,
        atualizadoEm: '',
      },
      PRICE_ACTUAL_EXPECTED,
    );
  }).timeout(10000);

  it('Busca todos os preços cadastrados', async ()=> {
    const context = new Context(new Price());
    const result = await context.getAll().catch(((erro)=> erro));
    assert.deepEqual(result, PRICE_ACTUAL_ALL);
  }).timeout(10000);

  it('Atualiza um preço na API planilhas', async ()=> {
    const context = new Context(new Price());
    const result = await context.create({ ...PRICE_ACTUAL, precoAtual: 5.31 }).catch(((erro)=> erro));
    assert.deepEqual({
      ...result,
      atualizadoEm: '',
    }, {
      ...PRICE_ACTUAL_EXPECTED,
      precoAtual: '5.31',
    });
  }).timeout(10000);

  it('Busca todos os preços cadastrados de um produto determinado', async ()=> {
    const context = new Context(new Price());
    const result = await context.getById(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual(
      result,
      PRICE_ACTUAL_ALL,
    );
  }).timeout(10000);

  it('Apaga todos os preços cadastrados de um produto determinado', async ()=> {
    const context = new Context(new Price());
    const result = await context.delete(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual(
      result,
      PRICE_ACTUAL_ALL,
    );
  }).timeout(10000);
});

describe('Testando o design strategies - mercado', ()=> {
  it('Criando um marcado na API planilha', async ()=> {
    const context = new Context(new Market());
    const result = await context.create(MARKET).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  }).timeout(10000);

  it('Buscando um marcado na API planilha pelo CNPJ', async ()=> {
    const context = new Context(new Market());
    const result = await context.getById(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  }).timeout(10000);

  it('Buscando todos os mercado da API planilhas', async ()=> {
    const context = new Context(new Market());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result, MARKET_EXPECTED);
  }).timeout(10000);

  it('Excluindo um marcado na API planilha pelo CNPJ', async ()=> {
    const context = new Context(new Market());
    const result = await context.delete(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  }).timeout(10000);
});
