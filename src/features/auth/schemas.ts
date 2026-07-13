import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(5, 'At least 5 characters'),
});

export const registerSchema = z.object({
  displayName: z.string().trim().min(2, 'At least 2 characters').max(40),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(5, 'At least 5 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
