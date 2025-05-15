import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// This type represents your Drizzle instance with the schema applied
export type DrizzlePostgres = PostgresJsDatabase<typeof schema>; 