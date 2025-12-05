# Paggo OCR Case

This project was developed as part of a technical assessment.  
The goal is to build an application that allows users to:

- Upload documents (e.g., invoices or billing files)
- Extract text through OCR processing
- View previously submitted documents and their extracted text
- Request contextual explanations using an LLM
- Download the file with the extracted text appended

The system is composed of:

- **Frontend (Next.js)**
- **Backend (NestJS)**
- **Database layer using Prisma ORM**

---

## 🚀 Technologies

### **Frontend**
- Next.js (App Router)
- React
- TypeScript

### **Backend**
- NestJS
- Prisma ORM
- Multer (file upload)
- OCR Engine (Tesseract or external API)
- LLM Integration (OpenAI API or similar)

### **Infrastructure**
- PostgreSQL (local or via Docker)
- Docker (optional)
- Node.js 18+

---

## 📁 Project Structure
```
paggo-ocr-case/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── documents/
│   │   ├── ocr/
│   │   ├── app.controller.spec.ts 
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│
├── .gitignore
├── docker-compose.yml
└── README.md
```
---

# 🛠️ Setup & Execution

## 1️⃣ Clone the Repository

```bash
git clone <REPO_URL>
cd paggo-ocr-case
```

---

## 2️⃣ Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Application available at:  
👉 http://localhost:3000

---

## 3️⃣ Backend Setup (NestJS)

```bash
cd backend
npm install
```

### Create your `.env` file:

```
DATABASE_URL="postgresql://paggo:paggo@localhost:5432/paggo?schema=public"
PORT=3001
JWT_SECRET="change-me"
OPENAI_API_KEY=""

```

### Run Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Start the Backend Server

```bash
npm run start:dev
```

API available at:  
👉 http://localhost:3001

---

# 📡 Planned API Endpoints

### Upload & OCR
```
POST /upload
```

### List all documents
```
GET /documents
```

### Get specific document
```
GET /documents/:id
```

### Request LLM explanation
```
POST /documents/:id/explain
```

### Download file with appended text
```
GET /documents/:id/download
```

---

# 🔐 Authentication

Possible strategies:

- NextAuth (Frontend) + JWT (Backend)
- Simplified mock user (demo purposes)

Example:

```ts
@UseGuards(AuthGuard)
```

---

# ✔️ Current Project Status

- [x] Frontend structure created  
- [x] Backend structure created  
- [x] Prisma initialized  
- [x] Initial README added  
- [ ] Database modeling  
- [ ] OCR service  
- [ ] File upload endpoint  
- [ ] LLM integration  
- [ ] Document listing & history  
- [ ] Frontend screens  

---

# 📌 Next Recommended Steps

1. Finalize `schema.prisma` models  
2. Implement `PrismaService`  
3. Implement file upload (Multer)  
4. Integrate OCR  
5. Build CRUD endpoints  
6. Add LLM explanation endpoint  
7. Build UI (upload, list, detail)  
8. Add authentication  

---

# 👩‍💻 Author

This project was developed exclusively for the Paggo technical assessment.  
Feedback and improvements are welcome.
