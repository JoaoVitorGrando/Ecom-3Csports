# 3C sports - Marketplace

Marketplace completo desenvolvido em Vue 3 + Vite, integrando com API REST autenticada via JWT.

## Funcionalidades
- Autenticação JWT (login, registro, renovação, roles)
- Controle de acesso por perfil (ADMIN, MODERATOR, CLIENT)
- Painel Admin: dashboard, produtos, cupons, categorias, pedidos, criação de moderador, perfil do admin
- Painel Moderador: gestão de produtos e estoque, visualização de pedidos
- Cliente: navegação por produtos/categorias, carrinho, checkout, histórico de pedidos, perfil
- Layout responsivo, visual moderno, feedback visual (toasts, loaders)
- Validações de formulário e mensagens de erro detalhadas

## Estrutura de Pastas
```
SoPeita/
├── public/                # Arquivos estáticos
├── src/
│   ├── assets/            # Imagens, CSS global
│   ├── components/        # Componentes reutilizáveis (cards, header, footer, etc)
│   ├── views/             # Páginas principais (Home, Admin, Produtos, etc)
│   ├── router/            # Rotas e proteção por perfil
│   ├── services/          # Integração com API (HttpService.js)
│   ├── stores/            # Estado global (Pinia)
│   ├── utils/             # Funções utilitárias (toast, etc)
│   └── main.js            # Ponto de entrada do app
├── index.html
├── package.json
└── README.md
```

## Instalação e uso
```sh
npm install
npm run dev
```
Acesse em http://localhost:5173

## Login ADMIN para testes
- Email: (seu email communitive)
- Senha: batata

## Tecnologias
- Vue 3 + Vite
- Pinia (estado global)
- Vue Router
- Axios
- Bootstrap Icons

## Observações
- O painel admin não exibe listagem de usuários (limitação da API)
- O projeto é responsivo e otimizado para mobile
- Qualquer dúvida, consulte o código ou peça ajuda!
