import { PrismaClient } from "@prisma/client";

// Create Prisma client with optimized connection pooling
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});



