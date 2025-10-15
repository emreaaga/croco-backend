import { pgTable, pgEnum, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
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

export const createUser = async data => {
  return await db
    .insert(UserTable)
    .values({ ...data })
    .returning({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
    });
};

export const findUserByEmail = async email => {
  return await db.select().from(UserTable).where(eq(UserTable.email, email));
};
