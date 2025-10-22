import z from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long').toLowerCase(),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.email('Please enter a valid email address').min(3).toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })
  .strict();

export const ChangePasswordSchema = z
  .object({
    old_password: z.string().min(6, 'Password must be at least 6 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  })
  .strict();
