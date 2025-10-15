import z from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3).toLowerCase(),
    email: z.email(),
    password: z.string().min(6),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().min(3).toLowerCase(),
    password: z.string().min(6),
  })
  .strict();
