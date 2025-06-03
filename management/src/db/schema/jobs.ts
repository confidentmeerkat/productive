import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  link: varchar(),
  title: varchar().notNull(),
  description: varchar(),
  skills: text().array(),
});
