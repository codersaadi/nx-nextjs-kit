'use server';

import { auth } from '../auth';
import { AuthenticationError } from './errors';

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session) return { user: null, error: new AuthenticationError() };
  if (!session.user.id) {
    console.log('unexpected thing , user without id');
    return {
      user: null,
      error: new AuthenticationError(),
    };
  }
  return { user: session.user, error: null };
};
