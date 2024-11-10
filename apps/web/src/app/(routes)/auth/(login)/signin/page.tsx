import React from 'react';
import { SignInForm } from '@org/shared';
import type { Metadata } from 'next';
import { signInAction } from '@web/lib/auth/signin-action';

export default function page() {
  return <SignInForm onSubmitAction={signInAction} />;
}

/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
  title: 'AppName - Signin to Continue ',
  description: '...',
};
