# API de desenvolvimento
# Node JS

1º npm init -y
2º nodemon (https://blog.rocketseat.com.br/ferramentas-de-compilacao-execucao-em-tempo-de-desenvolvimento-dos-projetos-em-node-js/)
3º surcrase (npm install --save-dev sucrase, npx sucrease-node index.js)
4º ESlint : https://blog.cod3r.com.br/organizacao-e-padronizacao-com-eslint/
5º Biblioteca MOCHA (https://mochajs.org/) para testes, desenvolvimento orientado a testes.

Siga o tutorial abaixo para utilizar esta aplicação. Esta aplicação será hospedada na plataforma vercel.

## Ambiente e Ferramentas:

- Axios: https://axios-http.com/ptbr/docs/intro
- Nookies: https://github.com/maticzav/nookies
- Styled Components: https://styled-components.com/
- Bootstrap: https://getbootstrap.com/docs/5.1/getting-started/introduction/

## **1. Configuração do Ambiente**

Crie uma pasta para armazenar o projeto. Você pode nomear e preencher os dados como quiser, este exemplo será nomeado como to-do-list:

```
$ mkdir to-do-list
$ cd to-do-list
```
Dentro da pasta, clone este repositório:

```bash
# Clonando este repositório
$ git clone <https://github.com/ArthurFCouto/to-do-list>

# Instalando as dependências
$ npm install 
```

## **2. Clonando o back-end**

Crie uma nova pasta, neste caso foi criado uma com o nome tasklistapi:

```
$ mkdir tasklistapi
$ cd tasklistapi
```

Dentro da pasta, clone orepositório:

```bash
# Clonando este repositório
$ git clone <https://github.com/ArthurFCouto/tasklistapi>
```

Siga as orientações do README e execute o back-end:

`$ npm run dev`

Se tudo correu bem, você poderá acessar a rota inicial do back-end via: ***POST http://localhost:3030/user***.

## **3. Executando o To-Do-List**

Para rodar esse projeto, você vai precisar adiciona a seguinte variável de ambiente no seu **.env**.

`REACT_APP_BASE_URL`

Caso esteja utilizando o heroku, colocar a url de hospedagem de sua API, caso esteja em ambiente de desenvolvimento, utilizar ***http://localhost:3030***.

Agora execute o comando de inicialização e veja o programa rodando em http://localhost:3000.

`$ npm start`

## **4. Enviando para o Github**

Crie um repositório no Github e envie sua aplicação.

```bash
# Adicionando todos os arquivos
$ git add *
# Criando o primeiro commit
$ git commit -m "first commit"
# Adicionando o endereço remoto
$ git remote add origin HTTPS_FORNECIDO_PELO_GIT
# Enviando o projeto para o git hub
$ git push -u origin main
```

> No Github criar a variável de ambiente com o mesmo valor do arquivo **.env**.

## **5. Hospedando a aplicação**

Abra a ***dashboard*** da plataforma vercel e acesse `new project`.

Conecte a plataforma com o Git e selecione a aplicação correspondente.

Fim.