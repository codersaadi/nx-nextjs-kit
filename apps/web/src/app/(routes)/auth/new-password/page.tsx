import { resetPasswordAction } from '../../../../lib/auth/forgot-password';
import { ResetPasswordForm } from '@org/shared';
import { ResetPasswordSchemaType } from '@org/shared/schema/auth.schema';
import React from 'react';
interface ResetPasswordProps {
  searchParams: {
    token?: string;
  };
}

export default function page({ searchParams }: ResetPasswordProps) {
  const { token } = searchParams;
  const resetPassword = (data: ResetPasswordSchemaType) =>
    resetPasswordAction(data, token);
  return <ResetPasswordForm onSubmitAction={resetPassword} />;
}
