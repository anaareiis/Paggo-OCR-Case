# Paggo OCR Case — Frontend (Next.js)

Este é o frontend do projeto Paggo OCR Case, desenvolvido em Next.js (Pages Router) com autenticação JWT via cookies HTTP-only, upload de arquivos, listagem de documentos, visualização de OCR e integração com LLM.

## 🚀 Tecnologias
- Next.js 14 (Pages Router)
- React 18
- TypeScript
- HTTP-only cookies para autenticação segura
- API Routes para proxiar chamadas ao backend

## 📂 Estrutura do Projeto
frontend/
  pages/
    api/
      login.ts
      logout.ts
      proxy-explain.ts
    documents/
      index.tsx
      [id].tsx
    login.tsx
  public/
  .env.local
  next.config.js
  package.json

## 🔧 Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz:

NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_COOKIE_NAME=paggo_token

## 🛠 Instalação
npm install

## ▶️ Rodar localmente
npm run dev  
Acesse http://localhost:3000

## 🔐 Autenticação JWT
Fluxo:
1. Usuário envia email/senha para `/api/login`
2. Backend retorna JWT
3. Cookie HTTP-only é criado
4. SSR usa esse cookie nas páginas protegidas

## 📄 Páginas
### /login
Tela de login.

### /documents
Lista documentos do usuário autenticado.

### /documents/[id]
Mostra:
- Preview do arquivo
- Texto OCR
- Chat LLM
- Botão de download (ZIP com OCR + original)

## 📡 Comunicação com Backend
Todas as requests usam automaticamente:
Authorization: Bearer <token>
Mas o token nunca fica visível no JavaScript — é lido via cookie HTTP-only.

## 📦 Scripts
npm run dev     → Desenvolvimento  
npm run build   → Build produção  
npm start       → Servir build  
npm run lint    → ESLint  

## 🧪 Testes
### Login via CURL
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.local","password":"secret123"}'

### Acessar documentos
http://localhost:3000/documents

## 🚀 Deploy
### Vercel
Basta rodar:
vercel deploy

Configuração recomendada:
- Certificar que NEXT_PUBLIC_API_URL aponte para o backend em produção
- Cookies com `secure: true`

## ✔️ Funcionalidades Concluídas
- Autenticação JWT (cookies HTTP-only)
- Login/logout
- Upload integrado ao backend
- Lista de documentos
- Página de detalhes com OCR
- Integração com LLM
- Download ZIP

## 📄 Licença
MIT © 2025
