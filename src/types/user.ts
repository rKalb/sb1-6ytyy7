import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'user']).default('user'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type UserCreateInput = z.infer<typeof userSchema>;