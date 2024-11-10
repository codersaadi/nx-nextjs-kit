import type { Metadata } from 'next';
import { SignUpForm } from '@org/shared';

import React from 'react';
import { signUpAction } from '@web/lib/auth/signup-action';

export default function page() {
  return <SignUpForm onSubmitAction={signUpAction} />;
}

/**
 * Meta data for the signin form page
 */
export const metadata: Metadata = {
  title: 'AppName -Create an Account for free ',
  description: '...',
};
