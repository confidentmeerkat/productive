import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env', // Ensure this points to your .env file in the management directory
});

export default {
  schema: './src/db/schema/*',
  out: './drizzle/migrations', // Directory to store migration files
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config; 