import { config } from "dotenv";
import path from "path";
import { PrismaClient } from "@prisma/client";

// Load environment variables from the root directory
config({ path: path.resolve(process.cwd(), "../../.env") });

const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  if (!dbUrl) {
    throw new Error(
      "Database URL not found. Please set DATABASE_URL or DB_URL environment variable."
    );
  }
  return dbUrl;
};

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
  log: ["error", "warn"],
});
