import { eq, desc, count, sql } from 'drizzle-orm';

import { UserTable } from '../models/user.model.js';
import { db } from '../config/db.js';

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

export const findUserById = async user_id => {
  return await db
    .select({
      password: UserTable.password,
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      role: UserTable.roles,
    })
    .from(UserTable)
    .where(eq(UserTable.id, user_id));
};

export const getUsers = async (page = 1, page_size = 4) => {
  const offset = (page - 1) * page_size;
  const data = await db
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

  const totalResult = await db.select({ count: count() }).from(UserTable);
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
};

export const changeUserStatus = async (user_id, user_status) => {
  return db
    .update(UserTable)
    .set({ status: user_status, updatedAt: sql`NOW()` })
    .where(eq(UserTable.id, user_id))
    .returning({ id: UserTable.id, status: UserTable.status });
};

export const changeUserPassword = async (user_id, new_password) => {
  return db
    .update(UserTable)
    .set({ password: new_password, updatedAt: sql`NOW()` })
    .where(eq(UserTable.id, user_id))
    .returning({ id: UserTable.id });
};

export const changeUserEmailStatus = async userId => {
  return db
    .update(UserTable)
    .set({ is_email_verifed: true, updatedAt: sql`NOW()` })
    .where(eq(UserTable.id, userId));
};