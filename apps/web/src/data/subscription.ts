import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import { db } from '../lib/db/init';
import { subscriptions } from '../lib/db/schema';

export async function createSubscription(subscription: {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}) {
  await db.insert(subscriptions).values(subscription);
}

export async function updateSubscription(subscription: {
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}) {
  await db
    .update(subscriptions)
    .set({
      stripePriceId: subscription.stripePriceId,
      stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    })
    .where(
      eq(subscriptions.stripeSubscriptionId, subscription.stripeSubscriptionId)
    );
}

export async function getSubscription(userId: string) {
  return await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
  });
}

export async function subscriptionCreated(
  subscription: Stripe.Subscription,
  customerId: string
) {
  // Retrieve existing subscription from the database
  const existingSubscription = await getSubscription(customerId);

  const newSubscriptionData = {
    userId: customerId, // Ensure this maps correctly to your user system
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    stripePriceId: subscription.items.data[0].price.id, // Assuming you're only dealing with one price
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), // Convert Unix timestamp
  };

  if (!existingSubscription) {
    // If no existing subscription, create a new one
    await createSubscription(newSubscriptionData);
    console.log('New subscription created:', subscription.id);
  } else {
    // If subscription exists, update the current period end and price
    await updateSubscription({
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
    console.log('Subscription updated:', subscription.id);
  }
}
