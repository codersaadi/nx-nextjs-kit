import { forgotPasswordAction } from '../../../../lib/auth/forgot-password';
import { ForgotPasswordForm } from '@org/shared';
import React from 'react';

export default function page() {
  return <ForgotPasswordForm onSubmitAction={forgotPasswordAction} />;
}
