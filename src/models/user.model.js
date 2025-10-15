import { pgTable, pgEnum, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { db } from '../config/db.js';

export const userStatusEnum = pgEnum('user_status', ['pending', 'approved', 'rejected']);

export const UserTable = pgTable('User', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  status: userStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
