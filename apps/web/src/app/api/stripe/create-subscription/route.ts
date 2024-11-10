// import {

// } from '@web/lib/db/repositories/subscription' // Adjust the import path as needed
import { createSubscription, getSubscription, updateSubscription } from '../../../../data/subscription';
import { getCurrentUser } from '../../../../lib/get-user';
import { stripe } from '../../../../lib/stripe/stripe';
import { type NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';

// Define the input schema for the request
const createSubscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const { user, error: userError } = await getCurrentUser();

    if (userError)
      return NextResponse.json({ error: userError.message }, { status: 401 });
    if (!user.id || !user.stripeCustomerId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Validate the incoming request body
    const body = await req.json();
    const validated = createSubscriptionSchema.safeParse(body);
    if (!validated.success) {
      const validationErrors = validated.error.errors
        .map((err) => err.message)
        .join(', ');
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    const { priceId } = validated.data;

    // Check if the user already has a subscription
    const subscriptionExists = await getSubscription(user.id);

    if (subscriptionExists?.stripeSubscriptionId) {
      // Update the existing subscription
      const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscriptionExists.stripeSubscriptionId
      );
      console.log('Updating the subscription');

      const subscription = await stripe.subscriptions.update(
        subscriptionExists.stripeSubscriptionId,
        {
          items: [
            {
              id: currentSubscriptionDetails.items.data[0].id,
              deleted: true,
            },
            { price: priceId },
          ],
          expand: ['latest_invoice.payment_intent'],
        }
      );

      // Update the subscription in the database
      await updateSubscription({
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      });

      // Type assertion and check
      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: latestInvoice?.payment_intent
          ? (latestInvoice.payment_intent as Stripe.PaymentIntent).client_secret
          : null,
      });
    }
    // Create a new subscription
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Create a new subscription in the database
    await createSubscription({
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: user.stripeCustomerId,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });

    // Type assertion and check
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: latestInvoice?.payment_intent
        ? (latestInvoice.payment_intent as Stripe.PaymentIntent).client_secret
        : null,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('🔴 Error creating/updating subscription:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
