import { eq, sql } from 'drizzle-orm';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { db } from '../../lib/db/init';
import { type Profile, profiles } from '../../lib/db/schema';
import type { CreateProfileInputSchema } from './userprofile.schema';
export async function saveProfile(
  userId: string,
  profile: CreateProfileInputSchema
) {
  try {
    const isExists = await profileExists(userId);
    if (isExists) {
      return await updateProfile(userId, profile);
    }
    return await createProfile(userId, profile);
  } catch (error) {
    console.error(`Error while saving profile: ${error}`);
    return null;
  }
}

export async function createProfile(
  userId: string,
  input: CreateProfileInputSchema
) {
  const [profile] = await db
    .insert(profiles)
    .values({
      userId,
      image: input.image,
      bio: input.bio,
      displayName:
        input.displayName ||
        uniqueNamesGenerator({
          dictionaries: [colors, animals],
          separator: ' ',
          style: 'capital',
        }),
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}
export async function updateProfile(
  userId: string,
  updateProfile: Partial<Profile>
) {
  await db
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getProfile(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  return profile;
}
export async function profileExists(userId: string): Promise<boolean> {
  const [result] = await db.execute(
    sql`SELECT EXISTS(SELECT 1 FROM ${profiles} WHERE ${profiles.userId} = ${userId})`
  );
  if (result && 'exists' in result && typeof result.exists === 'boolean') {
    return result.exists;
  }
  return false;
}
