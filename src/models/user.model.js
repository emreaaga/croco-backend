import { pgTable, pgEnum, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', ['pending', 'approved', 'rejected']);
export const userRolesEnum = pgEnum('roles', ['user', 'admin']);

export const UserTable = pgTable('user', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  status: userStatusEnum('status').default('pending').notNull(),
  is_email_verifed: boolean('is_email_verifed').default(false).notNull(),
  roles: userRolesEnum('roles').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
