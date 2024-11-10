'use client';
import { useFormAction } from '../../hooks/use-form-action';
import { SignupSchema, SignupSchemaType } from '../../schema/auth.schema';
import { MessageResponse } from '../../types';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import {
  AvatarIcon,
  EnvelopeOpenIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import { cn } from '../../lib/utils';
import { FormFeedback } from '../FormFeedback';
import { EyeClosedIcon } from 'lucide-react';
import Link from 'next/link';
import { LoaderButton } from '../loader-button';
import { useBoolean } from '../../hooks/use-boolean';
export default function SignUpForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: SignupSchemaType) => Promise<MessageResponse>;
}) {
  const { isPasswordShow, setPasswordShow } = useBoolean('passwordShow');
  const { form, message, isPending, onSubmit } = useFormAction({
    schema: SignupSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmitAction,
  });

  return (
    <Form {...form}>
      <form className="flex flex-col p-1 " onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name={'name'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input
                    disabled={isPending}
                    placeholder="Name"
                    type="text"
                    {...field}
                  />
                  <AvatarIcon
                    className={cn('top-2 right-2 w-5 h-5 absolute')}
                  />
                </div>
              </FormControl>
              <FormFeedback
                type="error"
                message={form.formState.errors.name?.message}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative ">
                  <Input
                    disabled={isPending}
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                  <EnvelopeOpenIcon
                    className={cn('top-2 right-2 w-5 h-5 absolute')}
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
                    className={cn('')}
                    placeholder="********"
                    type={isPasswordShow ? 'text' : 'password'}
                    {...field}
                  />
                  <span
                    onKeyUp={(e) => e.key === 'Enter' && onSubmit()}
                    className={cn(`top-2 hover:text-sky-500 cursor-pointer
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

        <LoaderButton
          isLoading={isPending}
          type="submit"
          className="w-full  mt-2"
        >
          Sign Up
        </LoaderButton>
      </form>
      <p className="mt-2">
        <Link className=" mr-2 text-sm underline" href={'/auth/signin'}>
          Aleady Have an Account?
        </Link>
      </p>
    </Form>
  );
}
