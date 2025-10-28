import { desc, count } from 'drizzle-orm';

import { ApplicationTable } from '../models/application.model.js';
import { db } from '../config/db.js';

class ApplicationRepository {
  constructor(database) {
    this.db = database;
  }

  async create(data) {
    return await this.db
      .insert(ApplicationTable)
      .values({ ...data })
      .returning({
        id: ApplicationTable.id,
        name: ApplicationTable.name,
        phoneNumber: ApplicationTable.phoneNumber,
      });
  }

  async findAll(page = 1, page_size = 4) {
    const offset = (page - 1) * page_size;

    const data = await this.db
      .select()
      .from(ApplicationTable)
      .orderBy(desc(ApplicationTable.createdAt))
      .limit(page_size)
      .offset(offset);

    const totalResult = await this.db.select({ count: count() }).from(ApplicationTable);
    const total = Number(totalResult[0].count);

    const totalPages = Math.ceil(total / page_size);
    const hasNext = page < totalPages;

    return {
      data,
      pagination: { total, totalPages, hasNext, page, page_size },
    };
  }
}

export const applicationRepository = new ApplicationRepository(db);
