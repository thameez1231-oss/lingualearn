/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.resolve(__dirname, '..', 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  process.exit(0);
}

let schema = fs.readFileSync(schemaPath, 'utf8');
const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('[prepare-db] PostgreSQL detected in DATABASE_URL.');
  console.log('[prepare-db] Switching schema.prisma provider to postgresql...');
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema, 'utf8');

  console.log('[prepare-db] Syncing schema and seeding tables...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  } catch (err) {
    console.warn('[prepare-db] Sync/seed warning:', err.message);
  }
} else {
  console.log('[prepare-db] SQLite database configuration maintained.');
}
