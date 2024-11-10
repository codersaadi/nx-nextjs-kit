import { signIn } from '@web/auth';
import SigninWithProviders, {
  AvailableProviders,
} from '@org/shared/components/auth/signin-with-providers';
import React from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
  const signinWithProvidersAction = async (provider: AvailableProviders) => {
    'use server';
    signIn(provider);
  };
  return (
    <>
      {children}
      <SigninWithProviders
        action={signinWithProvidersAction}
        withDescription={true}
        orPosition="top"
      />
    </>
  );
}
