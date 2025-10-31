import { eq } from 'drizzle-orm';

import { db } from '../config/db.js';
import { TokenTable } from '../models/token.model.js';

class TokenRepository {
  constructor(database) {
    this.db = database;
  }

  async saveRefreshToken(userId, token, expiresAt) {
    await this.deleteByUserId(userId);
    await this.db.insert(TokenTable).values({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }

  async findAll(userId) {
    return await this.db.select().from(TokenTable).where(eq(TokenTable.user_id, userId));
  }

  async deleteByUserId(userId) {
    await this.db.delete(TokenTable).where(eq(TokenTable.user_id, userId));
  }

  async findByToken(token) {
    return await this.db.query.TokenTable.findFirst({
      where: (t, { eq }) => eq(t.token, token),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            roles: true,
          },
        },
      },
    });
  }
}

export const tokenRepository = new TokenRepository(db);
