import z from 'zod';

export const ApplicationSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long').toLowerCase(),
    siteUrl: z.url('Please enter a valid website URL'),
    email: z.email('Please enter a valid email address').toLowerCase(),
    phoneNumber: z.string().min(3, 'Phone number must be at least 3 digits long').trim(),
  })
  .strict();
