'use server';
import { createProfileInputSchema } from './userprofile.schema';
import { authenticatedAction } from '../../lib/safe-action';
import { revalidatePath } from 'next/cache';
import { getProfile, saveProfile } from './user-profile';

export const getUserProfileAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const profile = await getProfile(ctx.user.id);

    return {
      image: profile?.image,
      displayName: profile?.displayName as string,
      bio: profile?.bio,
    };
  });

export const saveUserProfileAction = authenticatedAction
  .createServerAction()
  .input(createProfileInputSchema)
  .handler(async ({ input, ctx }) => {
    const profile = await saveProfile(ctx.user.id, input);
    revalidatePath('/');
    return {
      image: profile?.image,
      displayName: profile?.displayName,
      bio: profile?.bio,
    };
  });
