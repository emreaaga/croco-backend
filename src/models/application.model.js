import { integer, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { db } from '../config/db.js';

export const ApplicationTable = pgTable('application', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  siteUrl: text('site_url'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const createApplication = async data => {
  return await db
    .insert(ApplicationTable)
    .values({ ...data })
    .returning();
};
