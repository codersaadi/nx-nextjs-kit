import { signinMagic } from '../../../../../lib/auth/signin_magic-action';
import { MagicSignInForm } from '@org/shared';
import React from 'react';

export default function page() {
  return (
    <div>
      <MagicSignInForm onSubmitAction={signinMagic} />
    </div>
  );
}
