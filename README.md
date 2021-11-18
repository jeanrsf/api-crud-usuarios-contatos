# API CRUD de cadastro de usuarios e contatos 

Esse projeto irá simular uma RESTful API que irá fornecer as seguintes funcionalidades:

-   Fazer Login
-   Cadastrar Usuário
-   Detalhar Usuário
-   Editar Usuário
-   Listar produtos
-   Detalhar produtos
-   Cadastrar produtos
-   Editar produtos
-   Remover produtos

## **Requisitos para execultar o projeto**

1. Instalar versão do node `v12.22.6` ou superior
2. Possuir o banco de dados PostgreSQL local
3. Execultar `npm install` para instalar as dependências do projeto
4. Criar um arquivo `.env` na pasta principal do projeto seguindo o padrão do arquivo `.env-example`
5. Execultar o comando `npm run dev` para inicializar a aplicação

### **Banco de dados**

1. Criar um Banco de Dados PostgreSQL chamado `market_cubos`
2. Execultar o arquivo `database.sql` no PostgreSQL para criar a estrutura das tabelas

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

#### **Exemplo de requisição**

```json
// POST /usuario
{
    "nome": "José",
    "email": "jose@lojadasflores.com.br",
    "senha": "j1234",
    "nome_loja": "Loja das Flores"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status  201 
```
```json
// HTTP Status 400
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

#### **Exemplo de requisição**

```json
// POST /login
{
    "email": "jose@lojadasflores.com.br",
    "senha": "j1234"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```
```json
// HTTP Status 400
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.
---

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  

#### **Exemplo de requisição**
```json
// GET /usuario
```

#### **Exemplos de resposta**

```json
// HTTP Status  200
{
    "id": 1,
    "nome": "José",
    "email": "jose@lojadasflores.com.br",
    "nome_loja": "Loja das Flores"
}
```
```json
// HTTP Status  400
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  

#### **Exemplo de requisição**
```json
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@gmail.com",
    "senha": "j4321",
    "nome_loja": "Loja das Flores Cheirosas"
}
```

#### **Exemplos de resposta**
```json
// HTTP Status 200 
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar produtos do usuário logado**

#### `GET` `/produtos`

Essa é a rota que será chamada quando o usuario logado quiser listar todos produtos associados ao usuário logado.    

#### **Exemplo de requisição**
```json
// GET /produtos
```

#### **Exemplos de resposta**

```json
// HTTP Status 200
[
    {
        "id": 1,
        "usuario_id": 1,
        "nome": "Camisa preta",
        "quantidade": 12,
        "categoria": "Camisas",
        "preco": 4990,
        "descricao": "Camisa de malha com acabamento fino.",
        "imagem": "https://bit.ly/3ctikxq",
    },
    {
        "id": 2,
        "usuario_id": 1,
        "nome": "Calça jeans azul",
        "quantidade": 8,
        "categoria": "Calças",
        "preco": 4490,
        "descricao": "Calça jeans azul.",
        "imagem": "https://bit.ly/3ctikxq",
    },
]
```
```json
// HTTP Status 200 / 201 / 204
[]
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Detalhar um produto do usuário logado**

#### `GET` `/produtos/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter um dos seus produtos cadastrados.   

#### **Exemplo de requisição**
```json
// GET /produtos/44

```

#### **Exemplos de resposta**

```json
// HTTP Status 200 
{
    "id": 1,
    "usuario_id": 1,
    "nome": "Camisa preta",
    "quantidade": 8,
    "categoria": "Camisa",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
}
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Não existe produto cadastrado com ID 44."
}
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O usuário logado não tem permissão para acessar este produto."
}
```

### **Cadastrar produto para o usuário logado**

#### `POST` `/produtos`

Essa é a rota que será utilizada para cadastrar um produto associado ao usuário logado.  

#### **Exemplo de requisição**
```json
// POST /produtos
{
    "nome": "Camisa preta",
    "quantidade": 8,
    "categoria": "Camisa",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 201 
// Sem conteúdo no corpo (body) da resposta
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O preço do produto deve ser informado."
}
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para cadastrar um produto, o usuário deve estar autenticado."
}
```

### **Atualizar produto do usuário logado**

#### `PUT` `/produtos/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar um dos seus produtos cadastrados.  

#### **Exemplo de requisição**
```json
// PUT /produtos/2
{
    "nome": "Calça jeans preta",
    "quantidade": 22,
    "categoria": "Calças",
    "preco": 4490,
    "descricao": "Calça jeans preta.",
    "imagem": "https://bit.ly/3ctikxq"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200
// Sem conteúdo no corpo (body) da resposta
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O usuário autenticado não ter permissão para alterar este produto."
}
```

### **Excluir produto do usuário logado**

#### `DELETE` `/produtos/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir um dos seus produtos cadastrados.  

#### **Exemplo de requisição**
```json
// DELETE /produtos/88
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200
// Sem conteúdo no corpo (body) da resposta
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Não existe produto para o ID 88."
}
```
```json
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O usuário autenticado não tem permissão para excluir este produto."
}
```
