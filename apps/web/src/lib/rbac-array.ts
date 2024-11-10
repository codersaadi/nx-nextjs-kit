import { z } from 'zod';
import { rolesEnumArray } from './db/schema';

export const roleArrayGuardSchema = z.object({
  requiredRoles: z.array(z.enum(rolesEnumArray)),
});
export type RolesArrayGuardSchema = z.infer<typeof roleArrayGuardSchema>;
