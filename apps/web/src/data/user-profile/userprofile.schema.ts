import { z } from 'zod';

export const createProfileInputSchema = z.object({
  displayName: z
    .string({
      message: 'name is too short',
    })
    .max(45, 'maximum characters exceeded')
    .optional(),
  image: z.string().optional(),
  imageId: z.string().optional(),
  bio: z
    .string({
      message: 'bio must be between 0 and 120 characters',
    })
    .max(120, 'maximum characters exceeded')
    .optional(),
});

export type CreateProfileInputSchema = z.infer<typeof createProfileInputSchema>;
