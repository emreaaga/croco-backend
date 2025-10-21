import z from 'zod';

const UserPatchSchema = z
  .object({
    status: z.enum(['approved', 'rejected']),
  })
  .strict();

export default UserPatchSchema;
