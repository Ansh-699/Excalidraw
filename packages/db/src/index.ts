import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;

export const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl },
  },
  log: ["error", "warn"],
});
