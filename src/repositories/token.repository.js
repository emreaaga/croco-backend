import { db } from '../config/db.js';
import { TokenTable } from '../models/token.model.js';

class TokenRepository {
  constructor(database) {
    this.db = database;
  }

  async saveRefreshToken(userId, token, expiresAt) {
    await this.db.insert(TokenTable).values({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });
  }
}

export const tokenRepository = new TokenRepository(db);
