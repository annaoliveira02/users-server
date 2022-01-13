# Entrega 2
O _Users Service_ é um sistema de cadastro de usuários utilizando autorização e autenticação.

## Instalação/Utilização
Para ter acesso à estrutura da API, faça o fork e depois clone este projeto.

## Rotas
<h3 align='center'> Cadastro de usuário</h3>

`POST /signup - para cadastro de usuários FORMATO DA REQUISIÇÃO:`

```json
{
    "username": "Anna",
    "email": "anna@email.com",
    "password": "1234",
    "age": 28
}
```

Caso dê tudo certo, a resposta será assim:

`POST /signup - FORMATO DA RESPOSTA - STATUS 201`
```json
{
	"uuid": "cb00178f-715b-4df3-a07d-ce5499da50d7",
	"createdOn": "2022-01-13T17:26:50.853Z",
	"email": "anna@email.com",
	"age": 28,
	"username": "Anna"
}
```

<h3 align='center'> Login de usuário</h3>
`POST /login - para login de usuários FORMATO DA REQUISIÇÃO:`
```json
{
    "username": "Anna",
    "password":"1234"
}
```

Caso dê tudo certo, a resposta será assim:

`POST /login - FORMATO DA RESPOSTA - STATUS 200`
```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFubmEiLCJ1dWlkIjoiMDU5YzNiMGYtNTczYy00MmFjLTg4MzYtMDc3Njc3MWU0YTViIiwiaWF0IjoxNjQyMDk0MTc5LCJleHAiOjE2NDIwOTc3Nzl9.C7XaJYpL95ar-SgJjrmS8tJhC08R2LvJQp_XxJdixk8"
}
```

<h3 align='center'> Listar usuários</h3>
`GET /users - FORMATO DA REQUISIÇÃO (Authorization: Bearer {token})`

Caso dê tudo certo, a resposta será assim:

`GET /users - FORMATO DA RESPOSTA - STATUS 200`
```json
[
	{
		"uuid": "cb00178f-715b-4df3-a07d-ce5499da50d7",
		"createdOn": "2022-01-13T17:26:50.853Z",
		"password": "$2a$10$a4VzMSMLIayxh20LdUg.D.2ROE3vyfW2tlcLpPiWG.jjv1LF7oAcm",
		"email": "anna@email.com",
		"age": 28,
		"username": "Anna"
	},
	{
		"uuid": "6cec5432-771a-4586-beea-84ca53479fd5",
		"createdOn": "2022-01-13T17:34:06.631Z",
		"password": "$2a$10$oJ/sIIJccXji5euvg1v/c..PKShvSxdM2RKwNRsn6osTBrXM9ic.y",
		"email": "kenzie@email.com",
		"age": 21,
		"username": "Kenzinho"
	}
]
```

<h3 align='center'> Editar usuário</h3>
`PUT /users/:uuid/password -  FORMATO DA REQUISIÇÃO Authorization: Bearer {token}`
```json
{
"password":"4321"
}
```

Caso dê tudo certo a resposta será assim:

`PUT /users/:uuid/password - FORMATO DA RESPOSTA: 204 NO CONTENT`


## Erros 
<h3 align='center'>Validação de cadastro</h3>

A requisição retornará um erro caso os campos obrigatórios não sejam informados. 

`POST: localhost:3000/signup`
```json
{
    "username": "Anna",
    "email": "anna@email.com",
    "password": "1234"
}
```

`Status: 422 UNPROCESSABLE ENTITY`
```json
{
    "message": "age is a required field"
}
```

Ao tentar cadastrar um username que já consta no database, a mensagem será:

`Status: 400 BAD REQUEST`
```json
{
    "message": "username already exists"
}
```

<h3 align='center'>Login com usuário e senha</h3>

Caso as informações de login não estejam corretas, uma das seguintes mensagens será exibida:

`Status: 401 UNAUTHORIZED`
```json
{
    "message": "invalid username"
}
```

`Status: 401 UNAUTHORIZED`
```json
{
    "message": "invalid password"
}
```

<h3 align='center'>Rotas protegidas</h3>

Ao tentar nas rotas que requerem token (Authorization), a mensagem exibida será:

`Status: 401 UNAUTHORIZED`
```json
{
	"message": "missing authorization header"
}
```

<h3 align='center'>Mudança de senha</h3>

Ao tentar mudar a senha de um outro usuário que não seja o seu, a mensagem exibida será:
`Status: 401 UNAUTHORIZED`
```json
{
	"message": "request not allowed"
}
```

