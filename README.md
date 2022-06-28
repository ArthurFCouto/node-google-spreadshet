# NodeJS + Google SpreadSheet
# Catálogo online de produtos

## O Projeto :label:

Desenvolver uma API de busca de informações como preço médio, marca e categoria, de produtos do setor de varejo, consumindo a API da `Cosmos Bluesoft`. Utilizar o `Google Planilhas` para armazenar as informações sobre os produtos, bem como os cadastros de usuários e mercados. Criar e aplicar as regras de negocio para permitir que usuários autenticados informem o preço atual do produto.

## **:construction: Ambiente e Ferramentas:**

## Stack

- [NodeJS]()
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [JWT](https://jwt.io/)
- [Google Spreadsheet](https://www.npmjs.com/package/google-spreadsheet)
- [Path-to-regexp](https://www.npmjs.com/package/path-to-regexp)

## API

- [Cosmos Bluesoft](https://cosmos.bluesoft.com.br/api)

## **1. :bookmark_tabs: Conceitos abordados**

- Consumo de API
- Promises
- Testes unitários
- Padronização de respostas
- Design Patterns Strategy
- Regex
- Autenticação e Autorização

## **2. :gear: Funcionalidades**

- :white_check_mark: **Listar produtos cadastrados**: Listar os produtos cadastrados na planilha do Google.
- :white_check_mark: **Buscar produto pelo código**: Buscar um produto cadastrado na planilha do google pelo seu código GTIN. Caso não esteja cadastrado, a busca será realizada na base de dados da Cosmos.
- :white_check_mark: **Buscar produto pela descrição**: Listar os produtos cadastrados na planilha google que sua descrição corresponde a informação enviada. Poderá ser utilizada a base de dados da Cosmos caso seja informado no parâmetro.
- :negative_squared_cross_mark: **CRUD de usuários/mercados**: Cadastrar, buscar, atualizar ou exluir os usuários e dados dos mercados na planilha dos google.
- :negative_squared_cross_mark: **CRUD dos preços atuais**: Cadastrar, buscar, atualizar ou exluir os preços atuais do produtos, informado pelo usuário.

## :writing_hand: Notas

A aplicação foi desenvolvida com o intuito de aplicar os conhecimentos adquiridos durante os estudos sobre NodeJs.

A aplicação é um projeto pessoal para complementação dos estudos, com isso será atualizada e refatorada constantementemente.

O

Optei por **não utilizar framework** para entender melhor como eles funcionam por *debaixo dos panos*.

## :handshake: Contribuições

- Criticas, sujestões, melhorias ou colaborações, entrar em contato comigo pelos links abaixo:

:heavy_check_mark: [Instagram](https://www.instagram.com/arthur_fcouto/)

:heavy_check_mark: [Linkedin](https://www.linkedin.com/in/arthur-couto-b8181743/)

:e-mail: [Email](mailto:arthur_fouto@yahoo.com.br)




