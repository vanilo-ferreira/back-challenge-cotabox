# Challenge Cotabox

### Api

Para o Challenge Cotabox desenvolvi uma API que permite:

- Cadastrar uma empresa
- Fazer Login
- Checkar uma empresa criada
- Adicionar 'Participation' atrelada a uma empresa
- Listar as 'Participation' para um determinada empresa

**Importante: Cada empresa só conseguirá ver as 'participation' atreladas a ela!**

**Importante 2: O limite total de uma 'participation' para uma empresa é de 100%. O limite de colaboradores cadastrados também é de 100%, desde que cada colaborador tenha 1% de 'participation'**

### Banco de dados

Foi criado um Banco de Dados PostgreSQL na plataforma `railway.app` contendo as seguintes tabelas:

- companies
  - id
  - name
  - email
  - password

- holdings
  - id
  - first_name
  - last_name
  - participation
  - company_id

O esquema do banco de dados está adicionado na raiz do projeto, arquivo `schema.sql`.

## Endpoints

#### `POST` `/companies`

Essa é a rota que será utilizada para cadastrar uma empresa no sistema.

Ela:

- Valida se o e-mail informado já existe
- Valida os campos obrigatórios:
  - name
  - email
  - password
- Criptografa a senha antes de salvar no banco de dados
- Cadastrar a empresa no banco de dados

Exemplo do body a ser enviado:

```
{
    "name": "Empresa Tal",
    "email": "fulano@email.com",
    "password": "teste"
}
```

#### `POST` `/login`

Essa é a rota que permite a empresa cadastrado realizar o login no sistema.

Ela:

- Verifica se o e-mail existe
- Valida e-mail e senha
- Cria um token de autenticação com id da empresa
- Retorna um objeto com os dados da empresa (sem a senha) e o token criado

Exemplo do body a ser enviado:

```
{
    "email": "fulano@email.com",
    "password": "teste"
}
```

Exemplo de resposta da API:

```
{
    "usuario": {
        "id": 1,
        "name": "Empresa Tal",
        "email": "fulano@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

### ATENÇÃO: Todas as rotas abaixo são rotas protegidas e exigirão o token da empresa logada. Portanto, para cada implementação o token informado será validado.

#### `GET` `/profile`

Essa é a rota que será chamada quando a empresa quiser obter os dados do seu próprio perfil

Ela:

- Consulta a empresa no banco de dados pelo id contido no token informado
- Retorna um objeto com as informações da empresa exceto a senha

Exemplo de resposta da API:

```
{
    "id": 1,
    "name": "Empresa Tal",
    "email": "fulano@email.com"
}
```

#### `POST` `/holdings`

Essa é a rota que será chamada quando a empresa quiser cadastrar um colaborador e sua porcentagem de participação

Ela:

- Valida os campos obrigatórios:
  - first_name
  - last_name
  - participation
- Cadastra o colaborador e sua porcentagem de participação no banco de dados para o id do empresa logada

Exemplo do body a ser enviado:

```
{
    "first_name": "Carlos",
    "last_name": "Moura",
    "participation": 5
}
```

#### `GET` `/holdings`

Essa é a rota que será chamada quando a empresa logada quiser listar todos os seus colaboradores e sua respectiva porcentagem de participação.

Ela:

- Lista todos os colaboradores e sua respectiva porcentagem de participação da empresa logada e devolve no formato de `array` de holdings.

Exemplo de resposta da API:

```
[
    {
        "id": 1,
        "first_name": "Carlos",
        "last_name": "Moura",
        "participation": 5
        "company_id": 1,
    },
    {
        "id": 2,
        "first_name": "Fernanda",
        "last_name": "Oliveira",
        "participation": 15
        "company_id": 1,
    }
]
```

## Observações

O deploy da API foi feito na plataforma `railway.app` e pode ser acessada através do seguinte link: https://back-challenge-cotabox.up.railway.app

Obs.: A collection do postman está anexada a esse repositório, `Challenge Cotabox.postman_collection`.
