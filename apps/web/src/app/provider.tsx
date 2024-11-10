import { ThemeSwitch } from '@org/shared';
import { ShadCnProvider } from '@org/shared/server';
import React from 'react';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShadCnProvider>
      <div className="absolute top-3 right-3">
        <ThemeSwitch />
      </div>
      {children}
    </ShadCnProvider>
  );
}
