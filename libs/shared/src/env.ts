import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

// Define strict validation schemas
const serverSchema = {
  DATABASE_URL: z.string(),
  AUTH_SECRET: z.string(),
  RESEND_KEY: z.string().startsWith('re_', 'Invalid Resend API key format'),
  // Resend env
  RESEND_AUDIENCE_ID: z.string(),

  GITHUB_CLIENT_ID: z.string().min(1, 'GitHub Client ID is required'),
  GITHUB_CLIENT_SECRET: z.string().min(1, 'GitHub Client Secret is required'),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'Google Client Secret is required'),
  // Stripe env
  STRIPE_WEBHOOK_SECRET_LIVE: z.string().optional(),
  STRIPE_API_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  // env can be test, development, production
  NODE_ENV: z.enum(['test', 'development', 'production']),
};

const clientSchema = {
  NEXT_PUBLIC_HOST: z
    .string()
    .url()
    .refine((url) => !url.endsWith('/'), {
      message: 'HOST URL should not end with a trailing slash',
    }),
  // Stripe env
  NEXT_PUBLIC_PRICE_ID_BASIC: z.string(),
  NEXT_PUBLIC_PRICE_ID_PREMIUM: z.string(),
};

const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  server: serverSchema,
  client: clientSchema,

  // Improved configuration
  emptyStringAsUndefined: true,
  // skipValidation: process.env.NODE_ENV === 'test', // Skip validation during tests
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    // Resend env
    RESEND_KEY: process.env.RESEND_KEY,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    // Auth env
    AUTH_SECRET: process.env.AUTH_SECRET,
    // OAuth env
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

    // Stripe env
    STRIPE_WEBHOOK_SECRET_LIVE: process.env.STRIPE_WEBHOOK_SECRET_LIVE,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    NODE_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_PRICE_ID_BASIC: process.env.NEXT_PUBLIC_PRICE_ID_BASIC,
    NEXT_PUBLIC_PRICE_ID_PREMIUM: process.env.NEXT_PUBLIC_PRICE_ID_PREMIUM,
  },
});

export default env;
