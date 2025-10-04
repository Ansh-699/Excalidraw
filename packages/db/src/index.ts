import { config } from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Load environment variables from the root directory
config({ path: path.resolve(process.cwd(), "../../.env") });

// Get the database URL from environment
const getDatabaseUrl = () => {
  // Try different environment variable names
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  
  console.log("Looking for DATABASE_URL:", dbUrl ? "✓ Found" : "✗ Missing");
  
  if (!dbUrl) {
    throw new Error(
      "Database URL not found. Please set DATABASE_URL or DB_URL environment variable."
    );
  }
  
  return dbUrl;
};

// Create Prisma client with optimized connection pooling
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  log: ['error', 'warn'],
});



