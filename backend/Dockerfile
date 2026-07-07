FROM node:22-slim

# Tesseract (OCR engine) and Poppler (pdftoppm, used to rasterize PDF pages
# before OCR) are native binaries, not npm packages - they must be present
# on the host running the container.
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# prisma.config.ts requires DATABASE_URL to load, even though `generate`
# never connects to a database. The real URL is provided at runtime by
# the hosting platform's env vars.
RUN DATABASE_URL="postgresql://user:password@localhost:5432/db" npm run prisma:generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
