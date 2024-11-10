'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { userRepository } from '../../data/users';
import { PublicError } from '../errors';
import { authenticatedAction } from '../action-guard';
import { stripe } from './stripe';

const schema = z.object({
  priceId: z.union([
    z.literal(process.env.NEXT_PUBLIC_PRICE_ID_BASIC),
    z.literal(process.env.NEXT_PUBLIC_PRICE_ID_PREMIUM),
  ]),
});

export const generateStripeSessionAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(async ({ input: { priceId }, ctx: { user } }) => {
    const fullUser = await userRepository.getUserById(user.id);

    if (!fullUser) {
      throw new PublicError('no user found');
    }
    const email = fullUser.email;
    const userId = user.id;

    if (!userId) {
      throw new PublicError('no user id found');
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.HOST}/success`,
      cancel_url: `${process.env.HOST}/cancel`,
      payment_method_types: ['card'],
      customer_email: email ? email : undefined,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    if (stripeSession.url) redirect(stripeSession.url);
    throw new PublicError('stripe session url not found');
  });
