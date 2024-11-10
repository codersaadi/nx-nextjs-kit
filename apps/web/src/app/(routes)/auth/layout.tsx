import AuthFlexLayout from '../../../template/auth/AuthFlexLayout';
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthFlexLayout>{children}</AuthFlexLayout>;
}
