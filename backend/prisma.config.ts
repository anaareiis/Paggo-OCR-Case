// backend/prisma.config.ts
import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Caminho do schema
  schema: path.join(process.cwd(), "prisma", "schema.prisma"),

  // Caminho das migrations
  migrations: {
    path: path.join(process.cwd(), "prisma", "migrations"),
  },

  //
  // DATASOURCE — obrigatório no Prisma 7
  //
  datasource: {
    url: env("DATABASE_URL"), // URL carregada do .env
  },

  //
  // GENERATOR — opcional aqui, pois já está no schema.prisma
  //
  // generator: {
  //   provider: "prisma-client-js",
  //   output: "./generated/prisma",
  // },
});
