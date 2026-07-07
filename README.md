# Paggo OCR Case

A full-stack document processing system built for a technical assessment.  
The platform allows users to upload files, extract text using OCR, ask contextual questions to an LLM, and download processed results — all behind authenticated routes.

---

## 🚀 Features

- Upload documents (images or PDFs)  
- OCR text extraction (Tesseract.js)  
- LLM contextual explanations (OpenAI API or mock mode)  
- Document preview + text viewer  
- ZIP download (original file + extracted text)  
- JWT authentication (backend) + secure session cookie (frontend)  
- PostgreSQL database managed with Prisma ORM  
- GitHub Actions CI for both frontend and backend  

---

## 🧱 Tech Stack

### **Frontend**
- Next.js (App Router)
- React
- TypeScript
- Cookie-based authentication

### **Backend**
- NestJS
- Prisma ORM
- Multer (file uploads)
- Tesseract.js OCR
- OpenAI API integration (optional / fallback mock)
- JWT auth with guards and strategies

### **Infrastructure**
- PostgreSQL
- Node.js 18+
- Docker Compose
- CI pipelines (GitHub Actions)

---

# 📁 Project Structure

```
paggo-ocr-case/
├── frontend/
│    ├── pages/
│    │    ├── api/
│    │    │   ├── login.ts
│    │    │   ├── logout.ts
│    │    │   └── proxy-explain.ts
│    │    ├── documents/
│    │    │       ├── [id].tsx
│    │    │       └── index.tsx
│    │    └── login.tsx 
│    ├── public/
│    ├── package.json
│    └── README.md
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── documents/
│   │   ├── ocr/
│   │   ├── llm/
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .github/workflows/
│   ├── backend-ci.yml
│   └── frontend-ci.yml
│
├── docker-compose.yml
└── README.md
```

---

# 🛠️ Running the Project Locally

## 1️⃣ Clone the repository
```bash
git clone <REPO_URL>
cd paggo-ocr-case
```

---

# ⚙️ Backend Setup (NestJS + Prisma)

```bash
cd backend
npm install
```

### Required environment variables (`backend/.env`)
```ini
DATABASE_URL="postgresql://pguser:pgpass@localhost:5432/paggo"
PORT=3001
JWT_SECRET="change-me"
JWT_EXPIRES_IN="15m"
OPENAI_API_KEY=""        # Optional — empty string enables mock mode
BCRYPT_ROUNDS=10
```

### Run Prisma migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Start the backend
```bash
npm run dev
```

Backend runs on:  
👉 http://localhost:3001

---

# 💻 Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:  
👉 http://localhost:3000

### Required environment variables (`frontend/.env.local`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_COOKIE_NAME=paggo_token
```

---

# 🗄️ Database & Prisma

### Open Prisma Studio
```bash
cd backend
npx prisma studio
```

### Run migrations in production
```bash
npx prisma migrate deploy
```

---

# 📡 API Endpoints Overview

### Authentication
```http
POST /auth/register
POST /auth/login
```

### Documents
```http
POST /documents/upload
GET  /documents
GET  /documents/:id
GET  /documents/:id/download
POST /documents/:id/explain
```

---

# 🔐 Authentication Flow

1. User logs in through `/auth/login`.
2. Backend returns a JWT.
3. Frontend stores it in an **HTTP-only cookie**.
4. All authenticated routes include:

```
Authorization: Bearer <token>
```

Errors:
- **401 Unauthorized** → token missing or invalid  
- **403 Forbidden** → user tries to access another user's document  

---

# ✔️ Project Status

## Backend
- Complete Prisma schema  
- Working auth (JWT + guards)  
- Document upload, list, details, download  
- OCR service with Tesseract  
- LLM explanation endpoint  
- ZIP export  
- CI pipeline for lint + build  

## Frontend
- Login page  
- Upload page  
- Documents list and detail view  
- OCR text viewer  
- LLM explanation UI  
- Download button  
- Cookie-based session handling  
- Fully integrated with backend  

---

# 🚀 Deployment Guide

## Deploy Backend (Render / Heroku)

### Build:
```bash
npm ci
npm run build
```

### Start:
```bash
npm run start
```

### Required env vars:
```
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
OPENAI_API_KEY
PORT
BCRYPT_ROUNDS
```

---

## Deploy Frontend (Vercel)

**Root directory:** `frontend/`  
**Build command:** `npm run build`  
**Output directory:** `.next`  

### Required env vars:
```
NEXT_PUBLIC_API_URL=<your backend URL>
NEXT_PUBLIC_AUTH_COOKIE_NAME=paggo_token
```

---

# 👩‍💻 Author

This project was developed as part of the **Paggo Technical Assessment**.  
Feedback and contributions are welcome!

