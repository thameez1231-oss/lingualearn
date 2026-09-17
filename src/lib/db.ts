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
    const tmpDbPath = '/tmp/langualearn.db';
    const starterPath = path.join(process.cwd(), 'prisma', 'starter.db');

    if (fs.existsSync(starterPath)) {
      try {
        let shouldCopy = !fs.existsSync(tmpDbPath);
        if (!shouldCopy) {
          const starterStat = fs.statSync(starterPath);
          const tmpStat = fs.statSync(tmpDbPath);
          // If a new deployment includes an updated starter.db, refresh /tmp
          if (starterStat.mtimeMs > tmpStat.mtimeMs || tmpStat.size === 0) {
            shouldCopy = true;
          }
        }
        if (shouldCopy) {
          fs.copyFileSync(starterPath, tmpDbPath);
          console.log('[DB] Seeded writable /tmp database from starter.db');
        }
      } catch (err) {
        console.warn('[DB] Failed to sync starter.db to /tmp:', err);
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

let schemaEnsured = false;
export async function ensureDatabaseSchema(client = db) {
  if (schemaEnsured) return;
  schemaEnsured = true;

  try {
    const envUrl = process.env.DATABASE_URL || '';
    const isPostgres =
      envUrl.startsWith('postgres://') ||
      envUrl.startsWith('postgresql://') ||
      envUrl.startsWith('mysql://');
    if (isPostgres) return;

    // Self-healing SQLite schema creation
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FriendRequest" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "FriendRequest_receiverId_status_idx" ON "FriendRequest"("receiverId", "status");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "FriendRequest_senderId_idx" ON "FriendRequest"("senderId");
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Friendship" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "friendId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Friendship_userId_friendId_key" ON "Friendship"("userId", "friendId");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Friendship_userId_idx" ON "Friendship"("userId");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Friendship_friendId_idx" ON "Friendship"("friendId");
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Conversation" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user1Id" TEXT NOT NULL,
        "user2Id" TEXT NOT NULL,
        "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastMessageText" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Conversation_user1Id_lastMessageAt_idx" ON "Conversation"("user1Id", "lastMessageAt");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Conversation_user2Id_lastMessageAt_idx" ON "Conversation"("user2Id", "lastMessageAt");
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "readAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});

    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_receiverId_isRead_idx" ON "Message"("receiverId", "isRead");
    `).catch(() => {});
    await client.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");
    `).catch(() => {});

    // Ensure columns in User table cleanly without raw errors
    try {
      interface TableColumnInfo {
        name: string;
      }
      const columns = await client.$queryRawUnsafe<TableColumnInfo[]>('PRAGMA table_info("User");');
      const hasLastSeenAt = columns.some((c) => c.name === 'lastSeenAt');
      const hasUsername = columns.some((c) => c.name === 'username');

      if (!hasLastSeenAt) {
        await client.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "lastSeenAt" DATETIME;').catch(() => {});
      }
      if (!hasUsername) {
        await client.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "username" TEXT;').catch(() => {});
      }
    } catch {
      // Ignored
    }
  } catch (err) {
    console.warn('[DB] Schema self-heal notice:', err);
  }
}
