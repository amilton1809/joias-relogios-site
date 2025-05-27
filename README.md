# Site de Joias e Relógios - Documentação

## Visão Geral

Este projeto é um site completo de e-commerce para venda de joias e relógios, desenvolvido com Node.js, Express e React. O sistema inclui autenticação de usuários, painel administrativo, catálogo de produtos, carrinho de compras e checkout.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

### Backend (Node.js/Express)

- **Servidor**: Express.js
- **Banco de Dados**: MongoDB
- **Autenticação**: JWT (JSON Web Tokens)
- **Estrutura de Pastas**:
  - `/models`: Modelos de dados (usuários, produtos, pedidos)
  - `/controllers`: Controladores para lógica de negócios
  - `/routes`: Rotas da API
  - `/middleware`: Middlewares (autenticação, validação)

### Frontend (React)

- **Framework**: React
- **Roteamento**: React Router
- **Gerenciamento de Estado**: Context API
- **Estrutura de Pastas**:
  - `/src/components`: Componentes reutilizáveis
  - `/src/pages`: Páginas principais e admin
  - `/src/context`: Contextos (autenticação)

## Instruções de Instalação

### Requisitos

- Node.js (v14+)
- MongoDB

### Passo 1: Configurar o Backend

1. Navegue até a pasta do backend:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. 

4. Inicie o servidor:
   ```
   npm start
   ```

### Passo 2: Configurar o Frontend

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```
   

## Funcionalidades

### Autenticação

- Registro de usuários
- Login/Logout
- Proteção de rotas (usuário e admin)

### Painel Administrativo

- Dashboard com estatísticas
- Gerenciamento de produtos (CRUD)
- Visualização e gerenciamento de pedidos

### Loja

- Página inicial com produtos em destaque
- Catálogo de produtos com filtros
- Páginas de categorias (joias e relógios)
- Detalhes do produto

### Carrinho e Checkout

- Adição/remoção de produtos
- Atualização de quantidades
- Resumo do pedido
- Processo de checkout
- Simulação de pagamento

## Credenciais de Acesso


## Instruções para Windows

Se você estiver usando Windows, execute os comandos separadamente:

1. Navegue até a pasta do backend:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o servidor:
   ```
   npm start
   ```

4. Em outro terminal, navegue até a pasta do frontend:
   ```
   cd frontend
   ```

5. Instale as dependências:
   ```
   npm install
   ```

6. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```

## Solução de Problemas

### Erro de conexão com MongoDB
- Verifique se o MongoDB está instalado e rodando
- Confirme se a string de conexão no arquivo .env está correta

### Erro ao iniciar o servidor frontend
- Verifique se a porta 3000 está disponível
- Tente usar outro terminal ou reiniciar o computador

### Erro ao fazer login
- Verifique se o backend está rodando
- Confirme se as credenciais estão corretas

## Próximos Passos

- Implementação de pagamentos reais
- Sistema de avaliações de produtos
- Integração com serviços de email para notificações
- Painel de usuário mais completo
