/**
 * Prisma Client Singleton
 * 
 * Uses the singleton pattern to prevent multiple PrismaClient instances
 * during Next.js hot-reloading in development. Essential for serverless
 * environments like Vercel to avoid connection pool exhaustion.
 * 
 * Prisma v7: Uses the PrismaPg driver adapter for connection management.
 * The adapter receives the pooled DATABASE_URL for runtime queries,
 * while prisma.config.ts uses DIRECT_URL for migrations.
 */
import { PrismaClient } from "@prisma/client";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Extend globalThis to hold our Prisma singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Setup connection pool and adapter for Prisma v7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

/**
 * Create a new PrismaClient instance.
 * In Prisma v7, the connection URL is handled by the adapter
 * configured in prisma.config.ts for CLI operations.
 * For runtime, PrismaClient connects using the datasource config.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Prevent multiple instances in development (hot-reload safe)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
