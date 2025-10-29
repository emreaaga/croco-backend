import { eq, desc, count, sql } from 'drizzle-orm';

import { UserTable } from '../models/user.model.js';
import { db } from '../config/db.js';

class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async create(data) {
    return await this.db
      .insert(UserTable)
      .values({ ...data })
      .returning({
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
      });
  }

  async findByEmail(email) {
    return await this.db.select().from(UserTable).where(eq(UserTable.email, email));
  }

  async findById(user_id) {
    return await this.db
      .select({
        password: UserTable.password,
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        role: UserTable.roles,
        is_email_verifed: UserTable.is_email_verifed,
      })
      .from(UserTable)
      .where(eq(UserTable.id, user_id));
  }

  async findAll(page = 1, page_size = 4) {
    const offset = (page - 1) * page_size;
    const data = await this.db
      .select({
        id: UserTable.id,
        name: UserTable.name,
        email: UserTable.email,
        status: UserTable.status,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
      })
      .from(UserTable)
      .orderBy(desc(UserTable.createdAt))
      .limit(page_size)
      .offset(offset);

    const totalResult = await this.db.select({ count: count() }).from(UserTable);
    const total = Number(totalResult[0].count);

    const totalPages = Math.ceil(total / page_size);
    const hasNext = page < totalPages;

    return {
      data,
      pagination: {
        total,
        totalPages,
        hasNext,
        page,
        page_size,
      },
    };
  }

  async updateStatus(user_id, user_status) {
    return this.db
      .update(UserTable)
      .set({ status: user_status, updatedAt: sql`NOW()` })
      .where(eq(UserTable.id, user_id))
      .returning({ id: UserTable.id, status: UserTable.status });
  }

  async updatePassword(user_id, new_password) {
    return this.db
      .update(UserTable)
      .set({ password: new_password, updatedAt: sql`NOW()` })
      .where(eq(UserTable.id, user_id))
      .returning({ id: UserTable.id });
  }

  async updateEmailStatus(userId) {
    return this.db
      .update(UserTable)
      .set({ is_email_verifed: true, updatedAt: sql`NOW()` })
      .where(eq(UserTable.id, userId));
  }
}

export const userRepository = new UserRepository(db);
