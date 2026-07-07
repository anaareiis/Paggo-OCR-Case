# Paggo OCR – Backend  
Backend built with NestJS responsible for authentication, document upload, OCR processing, and data persistence using Prisma + PostgreSQL.

---

## 🚀 Technologies  
- NestJS (backend framework)  
- Prisma ORM v7 with PostgreSQL adapter  
- PostgreSQL  
- TypeScript  

---

## 📦 Installation
Run the following inside the backend folder:

npm install

---

## 🔧 Environment Setup
Create a `.env` file inside the `backend/` directory:

DATABASE_URL="postgresql://pguser:pgpass@localhost:5432/paggo"
PORT=3001
JWT_SECRET="change-me"
OPENAI_API_KEY=""

### Generate Prisma Client
npx prisma generate --schema=prisma/schema.prisma

### Run Migrations
npx prisma migrate dev --name init

---

## ▶️ Running the Server

# Development
npm run start:dev

# Production
npm run start:prod

---

## 🧪 Health Check Endpoint
The backend exposes a `/health` route confirming DB connection:

curl http://localhost:3001/health

Expected response:

{
  "ok": true,
  "usersCount": 0,
  "users": []
}

---

## 📁 Project Structure
backend/
   ├── src/
   │   ├── auth/
   │   ├── documents/
   │   ├── ocr/
   │   ├── llm/
   │   ├── prisma.service.ts
   │   ├── prisma.module.ts
   │   ├── app.module.ts
   │   └── main.ts
   ├── prisma/
   │   └── schema.prisma
   ├── .env.example
   ├── package.json
   └── tsconfig.json

---

## 🧱 Prisma Service (Prisma v7)
Prisma v7 requires a PostgreSQL adapter.  
This project already integrates it inside `src/prisma.service.ts`.

---

## 🛠 Useful Commands

# Open Prisma Studio
npx prisma studio

# Regenerate Prisma Client
npx prisma generate

# View migrations
ls prisma/migrations

---

## 📌 Backend Roadmap

- Implement document upload module  
- Integrate OCR (OpenAI Vision / Tesseract)  
- Document CRUD operations  
- JWT authentication  
- Logging & monitoring  

---

## 📄 License
MIT License.
