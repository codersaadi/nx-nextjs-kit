import type { Metadata } from 'next';
import { SignUpForm } from '@org/shared';
import { signUpAction } from '../../../../lib/auth/signup-action';

import React from 'react';

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
