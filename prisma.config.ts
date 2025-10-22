import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// ✅ Force-load .env from project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
