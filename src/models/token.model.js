import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { UserTable } from './user.model';

export const TokenTable = pgTable('token', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .notNull()
    .references(() => UserTable.id),
  token: text('token').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  revoked: boolean('revoked').default(false).notNull(),
});
