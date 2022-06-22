/* eslint-disable func-names */
/* eslint-disable no-undef */
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
  PRODUCT_LIST,
  PRODUTCT_LIST_NEXT,
  PRODUTCT_LIST_GOOGLE,
  PRICE_ACTUAL,
  MARKET,
  MARKET_EXPECTED,
  PRICE_ERROR,
  USER_ERROR,
  NOT_FOUND,
  MARKET_ERROR,
  PRODUCT_ERROR,
} = require('./mocks');

/*
  Rever o método de buscar a segunda página na API Cosmos, não enviar a URL completa como parametro
*/
describe('Cosmos Service', function () {
  this.timeout(10000);
  const errorMsg = 'Ops! Ocorreu um erro durante a pesquisa';

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
    assert.deepEqual(resultCompare, PRODUTCT_LIST_NEXT);
  });

  it('Verificando se retorna um erro default', async ()=> {
    const result = await cosmosService.geBytLins(0).catch((erro)=> erro);
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });
});

describe('Testando o design strategies - Usuários', function () {
  this.timeout(20000);
  const context = new Context(new User());
  const senhaUsuario = '********';
  const errorMsg = 'Erro ao buscar usuário';

  it('Verificando as validações de cadastro de usuário', async ()=> {
    const result = await context.create({}).catch((error)=> error);
    assert.deepEqual(result, USER_ERROR);
  });

  it('Verificando o método de cadastro de usuários', async ()=> {
    const result = await context.create(USER).catch((error)=> error);
    assert.deepEqual(result, { ...USER, senhaUsuario });
  });

  it('Atualizando um usuário pelo email', async ()=> {
    const result = await context.update(USER.emailUsuario, USER_FOR_UPDATE).catch((error)=> error);
    assert.deepEqual(result, { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Buscando todos os usuários cadastrados', async ()=> {
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result[2], { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Verificando o método de exclusão de usuário', async ()=> {
    const result = await context.delete(USER_FOR_UPDATE.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Verificando se retorna um erro default', async ()=> {
    const result = await context.getById(USER_FOR_UPDATE.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });

  it('Buscando um usuário pelo e-mail', async ()=> {
    const result = await context.getById(USER_LIST[0].emailUsuario).catch((error)=> error);
    assert.deepEqual(result, USER_LIST[0]);
  });
});

describe('Testando o design strategies - Produtos', function () {
  this.timeout(20000);
  const context = new Context(new Product());
  const origemGoogle = 'GOOGLESPREADSHEET';
  const description = 'refinado';

  it('Verifica o método delete na API planilhas', async ()=> {
    const result = await context.delete(PRODUCT_EXPECT.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, { ...PRODUCT_EXPECT, origem: origemGoogle });
  });

  it('Verifica as validações de cadastro do produto na API planilhas', async ()=> {
    const result = await context.create({ }).catch(((erro)=> erro));
    assert.deepEqual(result, PRODUCT_ERROR);
  });

  it('Verificando o método de cadastro de produtos na API planilhas', async ()=> {
    const result = await context.create(PRODUCT_EXPECT).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, { ...PRODUCT_EXPECT, origem: origemGoogle });
  });

  it('Busca um produto na API planilhas pelo códogio', async ()=> {
    const result = await context.getById(PRODUCT_EXPECT.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, { ...PRODUCT_EXPECT, origem: origemGoogle });
  });

  it('Busca todos os produtos da API planilhas', async ()=> {
    const result = await context.getAll().catch(((erro)=> erro));
    assert.deepEqual({ ...result, listaProduto: [] }, PRODUTCT_LIST_GOOGLE);
  });

  it('Busca um produto na API planilhas pela descrição', async ()=> {
    const result = await context.getByDescription(description).catch(((erro)=> erro));
    assert.deepEqual({ ...result, listaProduto: [] }, PRODUTCT_LIST_GOOGLE);
  });
});

describe('Testando o design strategies - Preços', function () {
  this.timeout(10000);
  const context = new Context(new Price());
  const precoAtual = '6.25';
  const atualizadoEm = '';
  const errorMsg = 'Ainda não há preços atuais cadastrados para o produto com código 7891024134702';

  it('Verifica o método de validação do cadastro de preços', async ()=> {
    const result = await context.create({}).catch(((erro)=> erro));
    assert.deepEqual(result, PRICE_ERROR);
  });

  it('Verifica o método de cadastro de preços', async ()=> {
    const result = await context.create(PRICE_ACTUAL).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm }, PRICE_ACTUAL);
  });

  it('Busca todos os preços cadastrados', async ()=> {
    const result = await context.getAll().catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual({ ...price[0], atualizadoEm }, PRICE_ACTUAL);
  });

  it('Verifica se um preço cadastrado é atualizado', async ()=> {
    const result = await context.create({ ...PRICE_ACTUAL, precoAtual }).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm }, { ...PRICE_ACTUAL, precoAtual });
  });

  it('Busca todos os preços cadastrados para um código de produto', async ()=> {
    const result = await context.getById(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual({ ...price[0], atualizadoEm }, { ...PRICE_ACTUAL, precoAtual });
  });

  it('Deleta todos os preços para um produto cadastrado', async ()=> {
    const result = await context.delete(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual({ ...price[0], atualizadoEm }, { ...PRICE_ACTUAL, precoAtual });
  });

  it('Verifica se retorna um erro default', async ()=> {
    const result = await context.getById(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });
});

describe('Testando o design strategies - Mercado', function () {
  this.timeout(20000);
  const context = new Context(new Market());
  const errorMsg = 'Erro ao buscar mercado';

  it('Verificando o método delete', async ()=> {
    const result = await context.delete(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Verificando se retorna um erro default', async ()=> {
    const result = await context.getById(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });

  it('Verificando o método de validação do cadastro de mercado', async ()=> {
    const result = await context.create({}).catch((error)=> error);
    assert.deepEqual(result, MARKET_ERROR);
  });

  it('Verificando o método de cadastro de mercado', async ()=> {
    const result = await context.create(MARKET).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Buscando um mercado pelo CNPJ', async ()=> {
    const result = await context.getById(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Buscando todos os mercados cadastrados', async ()=> {
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual({ ...result[0], atualizadoEm: '' }, MARKET_EXPECTED);
  });
});
