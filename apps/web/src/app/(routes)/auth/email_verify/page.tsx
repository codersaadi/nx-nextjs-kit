import { emailVerifyAction } from '@web/lib/auth/emailVerifyAction';
import { EmailVerifyForm } from '@org/shared';
import React from 'react';
interface EmailVerifyProps {
  searchParams: {
    token?: string;
  };
}
export default function page({ searchParams }: EmailVerifyProps) {
  const { token } = searchParams;
  return <EmailVerifyForm onSubmitAction={emailVerifyAction} token={token} />;
}
