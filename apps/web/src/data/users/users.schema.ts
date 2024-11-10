import { z } from 'zod';

export const emailSchema = z.string().email({
  message: 'Invalid email',
});
export const createUserSchema = z.object({
  email: emailSchema,
  password: z.string(),
  name: z.string(),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;

export const getAllUserSchema = z.object({
  pageIndex: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(), // "name.asc" or "email.desc"
  name: z.string().optional(),
  email: emailSchema.optional(),
  role: z.enum(['user', 'admin', 'member']).optional(),
});

export type GetAllUserSchemaInput = z.infer<typeof getAllUserSchema>;

export const updateUserPasswordSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>;
