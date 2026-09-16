import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // Remote database (PostgreSQL, Supabase, Neon, etc.)
  if (envUrl && (envUrl.startsWith('postgres://') || envUrl.startsWith('postgresql://') || envUrl.startsWith('mysql://'))) {
    return envUrl;
  }

  // Vercel Serverless / Lambda environment: root filesystem is read-only.
  // We use writable /tmp and seed it with starter.db on first invocation.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = '/tmp/lingualearn.db';

    if (!fs.existsSync(tmpDbPath)) {
      const starterPath = path.join(process.cwd(), 'prisma', 'starter.db');
      if (fs.existsSync(starterPath)) {
        try {
          fs.copyFileSync(starterPath, tmpDbPath);
          console.log('[DB] Seeded writable /tmp database from starter.db');
        } catch (err) {
          console.warn('[DB] Failed to copy starter.db:', err);
        }
      }
    }

    return `file:${tmpDbPath}`;
  }

  // Local development: use absolute path to dev.db to avoid directory resolution ambiguities
  const localDb = path.resolve(process.cwd(), 'prisma', 'dev.db');
  return `file:${localDb}`;
}

const resolvedDbUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedDbUrl ? { db: { url: resolvedDbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
