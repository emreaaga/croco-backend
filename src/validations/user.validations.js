import z from 'zod';

export const UserPatchSchema = z
  .object({
    status: z.enum(['approved', 'rejected']),
  })
  .strict();
