import z from 'zod';

export const ApplicationSchema = z
  .object({
    name: z.string().min(3).toLowerCase(),
    siteUrl: z.url(),
    email: z.email().toLowerCase(),
    phoneNumber: z.string().min(3).trim(),
  })
  .strict();
