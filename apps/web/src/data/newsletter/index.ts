import { db } from '@web/lib/db/init';
import { newsletters } from '@web/lib/db/schema';

/**
 * this inserts an email record into our database using drizzle-orm
 *
 * @param email the email to save
 */
export async function saveNewsletterSubscription(email: string) {
  await db
    .insert(newsletters)
    .values({
      email,
    })
    .onConflictDoNothing(); // we need onConflictDoNothing because if the same person tries to subscribe twice, we shouldn't crash for them
}
