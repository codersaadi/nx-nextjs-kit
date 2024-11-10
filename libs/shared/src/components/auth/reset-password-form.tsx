'use client';
import { useBoolean } from '../../hooks/use-boolean';
import { useFormAction } from '../../hooks/use-form-action';
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '../../schema/auth.schema';
import { MessageResponse } from '../../types';
import { LoaderButton } from '../loader-button';
import { FormFeedback } from '../FormFeedback';
import { EyeIcon, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

export default function ResetPasswordForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: ResetPasswordSchemaType) => Promise<MessageResponse>;
}) {
  const { isPasswordShow, setPasswordShow } = useBoolean('passwordShow');
  const { form, isPending, message, onSubmit } = useFormAction({
    schema: ResetPasswordSchema,
    onSubmitAction: onSubmitAction,
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
  });
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
      <Form {...form}>
        <form action={''} onSubmit={onSubmit}>
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
                      className={cn(`top-2 z-50 hover:text-sky-500 cursor-pointer
         right-2 absolute`)}
                      onClick={() => setPasswordShow(!isPasswordShow)}
                    >
                      {!isPasswordShow ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
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
          <FormField
            control={form.control}
            name={'confirmPassword'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
                      className={cn(`top-2 z-50 hover:text-sky-500 cursor-pointer
         right-2 absolute`)}
                      onClick={() => setPasswordShow(!isPasswordShow)}
                    >
                      {isPasswordShow ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </FormControl>
                <FormFeedback
                  type="error"
                  message={form.formState.errors.confirmPassword?.message}
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
            className="w-full mt-2 "
          >
            Change Password
          </LoaderButton>
        </form>
      </Form>
    </>
  );
}
