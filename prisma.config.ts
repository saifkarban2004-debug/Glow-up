/**
 * Prisma Configuration (v7)
 * 
 * In Prisma v7, database connection URLs have moved from schema.prisma
 * to this config file. The CLI uses DIRECT_URL for migrations (bypasses
 * connection poolers), while the runtime PrismaClient uses DATABASE_URL
 * (pooled) via the adapter pattern.
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Path to the Prisma schema file
  schema: "prisma/schema.prisma",

  // Migration configuration
  migrations: {
    path: "prisma/migrations",
  },

  // The CLI uses this URL for migrations (direct connection, no pooler)
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://neondb_owner:npg_VtXRif3lW2zS@ep-cold-brook-za8znk4g.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
