import { relations } from 'drizzle-orm';

import { UserTable } from './user.model.js';
import { TokenTable } from './token.model.js';

export const UserRelations = relations(UserTable, ({ many }) => ({
  tokens: many(TokenTable),
}));

export const TokenRelations = relations(TokenTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [TokenTable.user_id],
    references: [UserTable.id],
  }),
}));
