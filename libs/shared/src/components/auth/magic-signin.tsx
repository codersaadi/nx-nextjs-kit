'use client';
import { useFormAction } from '@org/shared/hooks/use-form-action';
import {
  MagicSignInSchema,
  MagicSignInType,
} from '@org/shared/schema/auth.schema';
import { MessageResponse } from '@org/shared/types';
import { FormFeedback } from '../FormFeedback';
import { LoaderButton } from '../loader-button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { AvatarIcon } from '@radix-ui/react-icons';
import { cn } from '@org/shared/lib/utils';
import { SignInFooter } from './signin-form';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function MagicSignInForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: MagicSignInType) => Promise<MessageResponse>;
}) {
  const { form, message, isPending, onSubmit } = useFormAction({
    onSubmitAction,
    schema: MagicSignInSchema,
    defaultValues: {
      email: '',
    },
  });
  return (
    <>
      <h2 className="font-semibold text-xl">Sign In with Email</h2>

      <Form {...form}>
        <form className="py-6 space-y-4" onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name={'email'}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={isPending}
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="rounded-md px-4 py-2"
                    />
                    <AvatarIcon
                      className={cn(
                        'top-2 w-5 h-5 right-3 absolute text-gray-400'
                      )}
                    />
                  </div>
                </FormControl>
                <FormFeedback
                  type="error"
                  message={form.formState.errors.email?.message}
                />
              </FormItem>
            )}
          />

          <LoaderButton className="w-full" type="submit" isLoading={isPending}>
            Sign In With Email
          </LoaderButton>
        </form>

        {/* Feedback message */}
        {message && (
          <div className="mt-4">
            <FormFeedback message={message.message} type={message.type} />
          </div>
        )}
      </Form>
      <SignInFooter>
        <Link href="/auth/signin">
          <Button className="text-md mx-auto w-full mt-4" variant={'link'}>
            Sign In with Credentials
          </Button>
        </Link>
      </SignInFooter>
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
