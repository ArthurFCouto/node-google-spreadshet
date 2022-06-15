/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert');
const cosmosService = require('../src/service/cosmosservice');
const { Context, User, Product } = require('../src/service/googlesheetsservice');
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
    const result = await context.update(USER.email_usuario, USER_FOR_UPDATE).catch((error)=> error);
    assert.deepEqual(result, USER_AFTER_UPDATE);
  }).timeout(10000);

  it('Buscando todos os usuários da API planilhas', async ()=> {
    const context = new Context(new User());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result, USER_LIST);
  }).timeout(10000);

  it('Excluindo um usuário pelo email', async ()=> {
    const context = new Context(new User());
    const result = await context.delete(USER.email_usuario).catch((error)=> error);
    assert.deepEqual(result, USER_AFTER_UPDATE);
  }).timeout(10000);

  it('Verificando se retorna um erro default', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER.email_usuario).catch((error)=> error);
    assert.deepEqual(result, USER_NOT_FOUND);
  }).timeout(10000);

  it('Buscando um usuário pelo e-mail', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER_LIST[0].email_usuario).catch((error)=> error);
    assert.deepEqual(result, USER_LIST[0]);
  }).timeout(10000);
});

describe('Testando o design strategies - Produtos', ()=> {
  it('Cria um produto na API planilhas pelo código', async ()=> {
    const context = new Context(new Product());
    const result = await context.create(PRODUCT_EXPECT_GOOGLE).catch(((erro)=> erro));
    assert.deepEqual(result, PRODUCT_EXPECT_GOOGLE);
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
    assert.deepEqual(result, PRODUCT_EXPECT_GOOGLE);
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
