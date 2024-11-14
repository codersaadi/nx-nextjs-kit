'use client';
import { LoaderButton } from '@org/shared';

import { generateStripeSessionAction } from '@web/lib/stripe/actions';
import type { ReactNode } from 'react';
import { useServerAction } from 'zsa-react';

export function CheckoutButton({
  className,
  children,
  priceId,
}: {
  className?: string;
  children: ReactNode;
  priceId: string;
}) {
  const { execute, isPending } = useServerAction(generateStripeSessionAction);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        execute({ priceId });
      }}
    >
      <LoaderButton isLoading={isPending} className={className}>
        {children}
      </LoaderButton>
    </form>
  );
}
