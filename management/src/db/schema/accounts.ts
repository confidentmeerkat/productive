import { relations } from 'drizzle-orm';
import {
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const typesEnum = pgEnum('types', ['upwork', 'linkedIn']);

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  type: typesEnum().default('upwork').notNull(),
  name: varchar().notNull().unique(),
  status: varchar().notNull(),
  meta: json().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
