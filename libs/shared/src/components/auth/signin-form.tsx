'use client';
import { useFormAction } from '../../hooks/use-form-action';
import { LoginSchema, LoginSchemaType } from '../../schema/auth.schema';
import { MessageResponse } from '../../types';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { AvatarIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { cn } from '../../lib/utils';
import { FormFeedback } from '../FormFeedback';
import { EyeClosedIcon } from 'lucide-react';
import Link from 'next/link';
import { LoaderButton } from '../loader-button';
import { useBoolean } from '../../hooks/use-boolean';
export default function SignInForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: LoginSchemaType) => Promise<MessageResponse>;
}) {
  const { isPasswordShow, setPasswordShow } = useBoolean('passwordShow');
  const { form, message, isPending, onSubmit } = useFormAction({
    schema: LoginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmitAction,
  });

  return (
    <Form {...form}>
      <form action={''} className="flex flex-col gap-3" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isPending}
                    placeholder="Email"
                    type="email"
                    {...field}
                    className=""
                  />
                  <AvatarIcon
                    className={cn('top-2 w-5 h-5 right-2 absolute')}
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
        <FormField
          control={form.control}
          name={'password'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isPending}
                    className=""
                    placeholder="*********"
                    type={isPasswordShow ? 'text' : 'password'}
                    {...field}
                  />
                  <span
                    onKeyUp={(e) => {
                      e.key === 'Enter' && onSubmit(e);
                    }}
                    className={cn(`top-2  hover:text-sky-500 cursor-pointer
     right-2 absolute`)}
                    onClick={() => setPasswordShow(!isPasswordShow)}
                  >
                    {isPasswordShow ? (
                      <EyeOpenIcon className="w-5 h-5" />
                    ) : (
                      <EyeClosedIcon className="w-5 h-5" />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormFeedback
                type="error"
                message={form.formState.errors.password?.message}
              />
            </FormItem>
          )}
        />
        {message && (
          <FormFeedback type={message.type} message={message.message} />
        )}

        <Link
          className="text-sm text-blue-600 hover:underline"
          href={'/auth/forgot-password'}
        >
          Forgot Password?
        </Link>
        <LoaderButton isLoading={isPending} variant={'default'} type="submit">
          Sign In
        </LoaderButton>
      </form>
    </Form>
  );
}
