/* eslint-disable no-undef */
const assert = require('assert');
// const cosmosService = require('../src/service/cosmosservice');
// const datoService = require('../src/service/datoservice');
const hookRoutes = require('../src/hooks/routes');

describe('Cosmos Service', ()=> {
  /* it('Busca um produto na api Cosmos pelo código', async ()=> {
    const expected = {
      id: 0,
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: 7891910000197,
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.890000000000001,
    };
    const result = await cosmosService.geBytLins(7891910000197);
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
    const result = await cosmosService.getByDescription('AÇÚCAR REFINADO UNIÃO 1KGS');
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
    const result = await cosmosService.getByNextPage('https://api.cosmos.bluesoft.com.br/products?page=2&query=ACUCAR+REFINADO+UNIAO+1KGS');
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, expected);
  }); */
});

describe('Dato Service', ()=> {
  /* it('Busca um produto na api DatoCMS pelo código', async ()=> {
    const expected = {
      id: '14559086',
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: '7891910000197',
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.890000000000001,
    };
    const result = await datoService.getProductByCode(7891910000197);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Exclui um produto na api DatoCMS pelo id', async ()=> {
    const expected = {
      id: '13819371',
      barcodeProduto: '',
      codigoProduto: '7891910000197',
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.890000000000001,
    };
    const result = await datoService.destroy(13819371);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Busca todos os produtos cadastrados da api Cosmos', async ()=> {
    const expected = {
      atualPagina: 1,
      porPagina: 5,
      totalPagina: 1,
      totalProduto: 5,
      proximaPagina: undefined,
      listaProduto: [ /*
        {
          id: '14459117',
          barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/340675E62DA15647D4252A09A58FE4A4.png',
          codigoProduto: '7891079000069',
          descricaoProduto: 'MACARRÃO INSTANTÂNEO NISSIN MIOJO BACON',
          imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891079000069',
          precoMedioNacional: 2.13,
        },
        {
          id: '14266494',
          barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/3CB92AFA49AAE8015C5CFCB02C3E8955.png',
          codigoProduto: '7896590817035',
          descricaoProduto: 'LEITE CONDENSADO CEMIL',
          imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7896590817035',
          precoMedioNacional: 4.59,
        },
        {
          id: '14266485',
          barcodeProduto: '',
          codigoProduto: '7891032014362',
          descricaoProduto: 'AZEITONA VERDE OLE FATIADA 130G',
          imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891032014362',
          precoMedioNacional: 6.425000000000001,
        },
        {
          id: '13843995',
          barcodeProduto: '',
          codigoProduto: '7891079000205',
          descricaoProduto: 'MACARRÃO INSTANTÂNEO LÁMEN CARNE NISSIN MIOJO PACOTE 85G',
          imagemProduto: 'https://miro.medium.com/max/1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg',
          precoMedioNacional: 2.1799999999999997,
        },
        {
          id: '13843911',
          barcodeProduto: '',
          codigoProduto: '7896036095041',
          descricaoProduto: 'EXTRATO DE TOMATE ELEFANTE LATA 130G',
          imagemProduto: 'https://miro.medium.com/max/1400/1*g09N-jl7JtVjVZGcd-vL2g.jpeg',
          precoMedioNacional: 2.35,
        },
        {
          id: '13820230',
          barcodeProduto: '',
          codigoProduto: '7891000949405',
          descricaoProduto: 'BISCOITO NEGRESCO NESTLÉ RECHEADO',
          imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891000949405',
          precoMedioNacional: 2.39,
        },
      ],
    };
    const result = await datoService.getAllProduct();
    const resultCompare = { ...result, listaProduto: [] };
    assert.deepEqual(resultCompare, expected);
  }).timeout(10000);

  it('Busca uma lista na api DatoCMS pela descrição', async ()=> {
    const expected = {
      atualPagina: 1,
      porPagina: 1,
      totalPagina: 1,
      totalProduto: 1,
      proximaPagina: undefined,
      listaProduto: [
        {
          id: '14266485',
          barcodeProduto: '',
          codigoProduto: '7891032014362',
          descricaoProduto: 'AZEITONA VERDE OLE FATIADA 130G',
          imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891032014362',
          precoMedioNacional: '6.425000000000001',
        },
      ],
    };
    const result = await datoService.getProductByDescription('AZEITONA VERDE OLE');
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Cria um produto na base DatoCMS', async ()=> {
    const product = {
      id: 14559086,
      barcodeProduto: 'https://api.cosmos.bluesoft.com.br/products/barcode/D215D0FAC1ACAEF6B65EE7ED9820DD38.png',
      codigoProduto: '7891910000197',
      descricaoProduto: 'AÇÚCAR REFINADO UNIÃO 1KGS',
      imagemProduto: 'https://cdn-cosmos.bluesoft.com.br/products/7891910000197',
      precoMedioNacional: 5.890000000000001,
    };
    const expected = {
      details: {
        data: [
          {
            code: 'VALIDATION_UNIQUE',
            message: 'VALIDATION_UNIQUE',
            value: 'lins',
          },
        ],
        status: 422,
        statusText: 'Unprocessable Entity',
      },
      error: 'Ops! Ocorreu um erro durante o cadastro do produto',
    };
    const result = await datoService.createProduct(product);
    assert.deepEqual(result, expected);
  }).timeout(10000);

  it('Cria um usuario na base DatoCMS', async ()=> {
    const user = {
      name: 'Arthur Couto',
      email: 'arthurfcouto@gmail.com',
      telephone: '38999414205',
      password: '12345678',
    };
    const expected = {
      details: {
        data: [
          {
            code: 'VALIDATION_UNIQUE',
            message: 'VALIDATION_UNIQUE',
            value: 'telephone',
          },
        ],
        status: 422,
        statusText: 'Unprocessable Entity',
      },
      error: 'Ops! Ocorreu um erro durante a criação do usuário',
    };
    const result = await datoService.createUser(user);
    assert.deepEqual(result, expected);
  }).timeout(10000); */
});

describe('Hook routes', ()=> {
  it('Testando encadeamento de funções', async ()=> {
    const expected = true;
    const result = hookRoutes.useRouter({ teste: 'Mariah' }, { teste: 'Arthur' }).get({ teste: 'Ingride' }, ()=> true);
    assert.deepEqual(result, expected);
  });
});
