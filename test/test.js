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
} = require('./mocks');

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
  const senhaUsuario = '********';
  const errorMsg = 'Erro ao buscar usuário';

  it('Verificando as validações de cadastro de usuário', async ()=> {
    const context = new Context(new User());
    const result = await context.create({ }).catch((error)=> error);
    assert.deepEqual(result, USER_ERROR);
  });

  it('Verificando o método de cadastro de usuários', async ()=> {
    const context = new Context(new User());
    const result = await context.create(USER).catch((error)=> error);
    assert.deepEqual(result, { ...USER, senhaUsuario });
  });

  it('Atualizando um usuário pelo email', async ()=> {
    const context = new Context(new User());
    const result = await context.update(USER.emailUsuario, USER_FOR_UPDATE).catch((error)=> error);
    assert.deepEqual(result, { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Buscando todos os usuários cadastrados', async ()=> {
    const context = new Context(new User());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result[2], { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Verificando o método de exclusão de usuário', async ()=> {
    const context = new Context(new User());
    const result = await context.delete(USER_FOR_UPDATE.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, { ...USER_FOR_UPDATE, senhaUsuario });
  });

  it('Verificando se retorna um erro default', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER_FOR_UPDATE.emailUsuario).catch((error)=> error);
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });

  it('Buscando um usuário pelo e-mail', async ()=> {
    const context = new Context(new User());
    const result = await context.getById(USER_LIST[0].emailUsuario).catch((error)=> error);
    assert.deepEqual(result, USER_LIST[0]);
  });
});

/*
  Criar método de validação de cadastro de produto
*/
describe.only('Testando o design strategies - Produtos', ()=> {
  const origemGoogle = 'GOOGLESPREADSHEET';
  const description = 'refinado';

  it('Verifica o método delete na API planilhas', async ()=> {
    const context = new Context(new Product());
    const result = await context.delete(PRODUCT_EXPECT.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, { ...PRODUCT_EXPECT, origem: origemGoogle });
  }).timeout(10000);

  it('Verificando o método de cadastro de produtos na API planilhas', async ()=> {
    const context = new Context(new Product());
    const result = await context.create(PRODUCT_EXPECT).catch(((erro)=> erro));
    assert.deepEqual({ ...result, atualizadoEm: '' }, { ...PRODUCT_EXPECT, origem: origemGoogle });
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

  it('Busca um produto na API planilhas pela descrição', async ()=> {
    const context = new Context(new Product());
    const result = await context.getByDescription(description).catch(((erro)=> erro));
    assert.deepEqual({
      ...result,
      listaProduto: [],
    }, {
      ...PRODUTCT_LIST_GOOGLE,
      listaProduto: [],
      proximaPagina: undefined,
    });
  }).timeout(10000);
});

describe('Testando o design strategies - Preços', function () {
  this.timeout(10000);
  const precoAtual = '6.25';
  const atualizadoEm = '';
  const errorMsg = 'Ainda não há preços atuais cadastrados para o produto com código 7891024134702';

  it('Verifica o método de validação', async ()=> {
    const context = new Context(new Price());
    const result = await context.create({ }).catch(((erro)=> erro));
    assert.deepEqual(
      result,
      PRICE_ERROR,
    );
  }).timeout(10000);

  it('Verifica o método create', async ()=> {
    const context = new Context(new Price());
    const result = await context.create(PRICE_ACTUAL).catch(((erro)=> erro));
    assert.deepEqual(
      {
        ...result,
        atualizadoEm,
      },
      PRICE_ACTUAL,
    );
  }).timeout(10000);

  it('Busca todos os preços cadastrados', async ()=> {
    const context = new Context(new Price());
    const result = await context.getAll().catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual(
      {
        ...price[0],
        atualizadoEm,
      },
      PRICE_ACTUAL,
    );
  }).timeout(10000);

  it('Verifica a atualização de preço cadastrado', async ()=> {
    const context = new Context(new Price());
    const result = await context.create({ ...PRICE_ACTUAL, precoAtual }).catch(((erro)=> erro));
    assert.deepEqual({
      ...result,
      atualizadoEm,
    }, {
      ...PRICE_ACTUAL,
      precoAtual,
    });
  }).timeout(10000);

  it('Busca todos os preços cadastrados para um código de produto', async ()=> {
    const context = new Context(new Price());
    const result = await context.getById(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual({
      ...price[0],
      atualizadoEm,
    }, {
      ...PRICE_ACTUAL,
      precoAtual,
    });
  }).timeout(10000);

  it('Deleta todos os preços para um produto cadastrado', async ()=> {
    const context = new Context(new Price());
    const result = await context.delete(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    const expected = result[0];
    const price = expected[PRICE_ACTUAL.codigoProduto];
    assert.deepEqual({
      ...price[0],
      atualizadoEm,
    }, {
      ...PRICE_ACTUAL,
      precoAtual,
    });
  }).timeout(10000);

  it('Verifica se retorna um erro default', async ()=> {
    const context = new Context(new Price());
    const result = await context.getById(PRICE_ACTUAL.codigoProduto).catch(((erro)=> erro));
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  }).timeout(10000);
});

describe('Testando o design strategies - mercado', function () {
  this.timeout(20000);
  const errorMsg = 'Erro ao buscar mercado';

  it('Verificando o método de exclusão', async ()=> {
    const context = new Context(new Market());
    const result = await context.delete(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Verificando se retorna um erro default', async ()=> {
    const context = new Context(new Market());
    const result = await context.getById(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual(result, { ...NOT_FOUND, error: errorMsg });
  });

  it('Verificando o método de validação do cadastro de mercado', async ()=> {
    const context = new Context(new Market());
    const result = await context.create({}).catch((error)=> error);
    assert.deepEqual(result, MARKET_ERROR);
  });

  it('Verificando o método de cadastro de mercado', async ()=> {
    const context = new Context(new Market());
    const result = await context.create(MARKET).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Buscando um mercado pelo CNPJ', async ()=> {
    const context = new Context(new Market());
    const result = await context.getById(MARKET.cnpjMercado).catch((error)=> error);
    assert.deepEqual({ ...result, atualizadoEm: '' }, MARKET_EXPECTED);
  });

  it('Buscando todos os mercados cadastrados', async ()=> {
    const context = new Context(new Market());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual({ ...result[0], atualizadoEm: '' }, MARKET_EXPECTED);
  });
});
