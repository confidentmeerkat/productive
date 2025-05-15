const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const dotenv = require('dotenv');

// Load environment variables from .env file in the current working directory (project root)
dotenv.config({ path: '.env' });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  let sql;
  try {
    // For migrations, we need a new connection client that can handle multiple statements if needed
    // and doesn't have a specific schema attached by default like our app's Drizzle instance.
    sql = postgres(connectionString, { max: 1 }); // max: 1 is important for migrations
    console.log('Connected to database for migration.');
  } catch (err) {
    console.error('Failed to connect to database for migration:', err);
    process.exit(1);
  }

  try {
    console.log('Running migrations...');
    await migrate(drizzle(sql), { migrationsFolder: './drizzle/migrations' });
    console.log('Migrations applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await sql.end();
    console.log('Database connection closed.');
  }
}

main(); 