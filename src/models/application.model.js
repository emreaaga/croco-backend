import { integer, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { db } from '../config/db.js';
import { desc, count } from 'drizzle-orm';

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
    .returning({
      id: ApplicationTable.id,
      name: ApplicationTable.name,
      phoneNumber: ApplicationTable.phoneNumber,
    });
};

export const getApplications = async (page = 1, page_size = 4) => {
  const offset = (page - 1) * page_size;
  const data = await db
    .select()
    .from(ApplicationTable)
    .orderBy(desc(ApplicationTable.createdAt))
    .limit(page_size)
    .offset(offset);

  const totalResult = await db.select({ count: count() }).from(ApplicationTable);
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
