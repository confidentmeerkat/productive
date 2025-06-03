import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core';
import { users } from './users'; // Assuming users schema is in the same directory

export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // Foreign key to users table
  label: varchar('label', { length: 255 }).notNull(),
  apiKeyHash: text('api_key_hash').notNull().unique(), // Store hash of the API key
  apiKeyPrefix: varchar('api_key_prefix', { length: 8 }).notNull().unique(), // Store a short, unique, non-sensitive prefix for identification
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
});

// Optionally, define relations if you use Drizzle's relational queries extensively
// import { relations } from 'drizzle-orm';
// export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
//   user: one(users, {
//     fields: [apiKeys.userId],
//     references: [users.id],
//   }),
// }));
