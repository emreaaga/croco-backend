import z from 'zod';

export const PaginateValidation = z
  .object({
    page: z
      .string()
      .transform(Number)
      .refine(n => !isNaN(n) && n > 0, 'page must be a positive number')
      .default('1'),
    page_size: z
      .string()
      .transform(Number)
      .refine(n => !isNaN(n) && n > 0 && n <= 100, 'page_size must be between 1 and 100')
      .default('10'),
  })
  .strict();
