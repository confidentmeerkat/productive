import { relations } from 'drizzle-orm';
import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { jobs } from './jobs';

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  accountId: integer('accont_id').notNull(),
  userId: integer('user_id').notNull(),
  jobId: integer('job_id')
    .notNull()
    .references(() => jobs.id),
  coverLetter: varchar('cover_letter'),
  extraQuestions: json('extra_questions').array(),
  keywords: text('keywords').array(),
  status: varchar(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const applicationRelations = relations(applications, ({ one }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
}));
