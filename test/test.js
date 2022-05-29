/* eslint-disable func-names */
/* eslint-disable no-undef */
const assert = require('assert');
const cosmosService = require('../src/service/cosmosservice');
const { Context, User, Product } = require('../src/service/googlesheetsservice');

describe('Cosmos Service', ()=> {
  /* it('Busca um produto na api Cosmos pelo código', async ()=> {
    const expected = {
      id: 0,
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: 7891910000197,
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 7.885,
    };
    const result = await cosmosService.geBytLins(7891910000197).catch((erro)=> erro);
    assert.deepEqual(result, expected);
  });

  it('Busca uma lista na api Cosmos pela descrição', async ()=> {
    const expected = {
      atualPagina: 1,
      porPagina: 30,
      totalPagina: 4,
      totalProduto: 103,
      proximaPagina: 'https://api.cosmos.bluesoft.com.br/products?page=2&query=ACUCAR+REFINADO+UNIAO+1KGS',
      listaProduto: [],
    };
    const result = await cosmosService.getByDescription('AÇÚCAR REFINADO UNIÃO 1KGS').catch((erro)=> erro);
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, expected);
  });

  it('Busca a segunda página da lista retornada pela api Cosmos', async ()=> {
    const expected = {
      atualPagina: 2,
      porPagina: 30,
      totalPagina: 4,
      totalProduto: 103,
      proximaPagina: 'https://api.cosmos.bluesoft.com.br/products?page=3&query=ACUCAR+REFINADO+UNIAO+1KGS',
      listaProduto: [],
    };
    const result = await cosmosService.getByNextPage('https://api.cosmos.bluesoft.com.br/products?page=2&query=ACUCAR+REFINADO+UNIAO+1KGS').catch((erro)=> erro);
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, expected);
  }); */
});

describe('Testando o design strategies - Usuários', ()=> {
  /* it('Criando um usuário na API planilha', async ()=> {
    const context = new Context(new User());
    const expected = {
      id: 0,
      nome_usuario: 'Ingride',
      email_usuario: 'ingride@gmail.com',
      telefone_usuario: '38999731482',
      senha_usuario: '12345678',
      imagem_usuario: '',
    };
    const result = await context.create({
      nome_usuario: 'Ingride',
      email_usuario: 'ingride@gmail.com',
      telefone_usuario: 38999731482,
      senha_usuario: '12345678',
    }).catch((error)=> error);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Atualizando um usuário pelo email na API planilha', async ()=> {
    const context = new Context(new User());
    const expected = {
      id: 0,
      nome_usuario: 'Arthur',
      email_usuario: 'arthur@gmail.com',
      telefone_usuario: '38999414205',
      senha_usuario: '12345678',
      imagem_usuario: 'https://source.unsplash.com/640x640/?user',
    };
    const result = await context.update('arthur@gmail.com', {
      nome_usuario: 'Arthur',
      telefone_usuario: 38999414205,
      imagem_usuario: 'https://source.unsplash.com/640x640/?user',
    }).catch((error)=> error);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Buscando todos os usuários da API planilhas', async ()=> {
    const expected = [
      {
        id: 0,
        nome_usuario: 'Arthur',
        email_usuario: 'arthur@gmail.com',
        telefone_usuario: '38999414205',
        senha_usuario: '12345678',
        imagem_usuario: 'https://source.unsplash.com/640x640/?user',
      },
      {
        id: 0,
        nome_usuario: 'Mariah',
        email_usuario: 'mariah@gmail.com',
        telefone_usuario: '38998628103',
        senha_usuario: '12345678',
        imagem_usuario: 'https://source.unsplash.com/640x640/?user',
      },
      {
        id: 0,
        nome_usuario: 'Ingride',
        email_usuario: 'ingride@gmail.com',
        telefone_usuario: '38998628103',
        senha_usuario: '12345678',
        imagem_usuario: '',
      },
    ];
    const context = new Context(new User());
    const result = await context.getAll().catch((error)=> error);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Excluindo um usuário pelo email', async ()=> {
    const context = new Context(new User());
    const expected = {
      id: 0,
      nome_usuario: 'Ingride',
      email_usuario: 'ingride@gmail.com',
      telefone_usuario: '38998628103',
      senha_usuario: '12345678',
      imagem_usuario: '',
    };
    const result = await context.delete('ingride@gmail.com').catch((error)=> error);
    assert.deepEqual(result, expected);
  }).timeout(10000); */
});

describe('Testando o design strategies - Produtos', ()=> {
  /* it('Cria um produto na API planilhas pelo código', async ()=> {
    const context = new Context(new Product());
    const expected = {
      id: 0,
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: '789191000019',
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.89,
    };
    const result = await context.create(expected).catch(((erro)=> erro));
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Busca todos os produtos na API planilhas', async ()=> {
    const context = new Context(new Product());
    const expected = {
      atualPagina: 1,
      listaProduto: [],
      porPagina: 2,
      proximaPagina: undefined,
      totalPagina: 1,
      totalProduto: 2,
    };
    const result = await context.getAll().catch(((erro)=> erro));
    assert.deepEqual({ ...result, listaProduto: [] }, expected);
  }).timeout(10000);

  it('Apaga um produto na API planilhas pelo código', async ()=> {
    const context = new Context(new Product());
    const expected = {
      id: 0,
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: '789191000019',
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.89,
    };
    const result = await context.delete('789191000019').catch(((erro)=> erro));
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Busca um produto na API planilhas pela descrição', async ()=> {
    const expected = {
      atualPagina: 1,
      listaProduto: [],
      porPagina: 1,
      proximaPagina: undefined,
      totalPagina: 1,
      totalProduto: 1,
    };
    const context = new Context(new Product());
    const result = await context.getByDescription('refinado').catch(((erro)=> erro));
    assert.deepEqual({ ...result, listaProduto: [] }, expected);
  }).timeout(10000); */
});
