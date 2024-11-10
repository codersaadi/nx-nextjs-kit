'use client';
import { useFormAction } from '../../hooks/use-form-action';
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from '../../schema/auth.schema';
import { MessageResponse } from '../../types';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { FormFeedback } from '../FormFeedback';
import { LoaderButton } from '../loader-button';
export default function ForgotPasswordForm({
  onSubmitAction,
}: {
  onSubmitAction: (data: ForgotPasswordSchemaType) => Promise<MessageResponse>;
}) {
  const { form, isPending, onSubmit, message } = useFormAction({
    schema: ForgotPasswordSchema,
    onSubmitAction,
    defaultValues: {
      email: '',
    },
  });
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
      <Form {...form}>
        <form onSubmit={onSubmit}>
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
                      className={cn('')}
                      placeholder="xyz@yourmail.com"
                      type={'email'}
                      {...field}
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
          {message && (
            <FormFeedback type={message.type} message={message.message} />
          )}
          <LoaderButton
            isLoading={isPending}
            type="submit"
            className="w-full mt-2 "
          >
            Confirm Reset Password
          </LoaderButton>
        </form>
      </Form>
    </>
  );
}
