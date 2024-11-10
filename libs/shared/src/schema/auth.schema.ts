import * as z from 'zod';
const EmailAddressError = 'Please enter a valid email address';
const PasswordError = 'Password is too short';
export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: EmailAddressError,
  }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(7, {
    message: PasswordError,
  }),
  confirmPassword: z.string().min(7, {
    message: PasswordError,
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: EmailAddressError,
  }),
  password: z.string().min(1, {
    message: PasswordError,
  }),
});

export const SignupSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: EmailAddressError,
  }),
  password: z.string().min(7, { message: PasswordError }),
});
export const MagicSignInSchema = z.object({
  email: z.string().email({
    message: EmailAddressError,
  }),
});
export type MagicSignInType = z.infer<typeof MagicSignInSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
