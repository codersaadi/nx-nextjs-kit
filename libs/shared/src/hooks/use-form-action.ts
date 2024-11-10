import { zodResolver } from '@hookform/resolvers/zod';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { useState, useTransition } from 'react';
import {
  type UseFormReturn,
  useForm,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import type * as z from 'zod';
import { MessageResponse } from '../types';

export type FormMessage = {
  type: 'error' | 'success';
  message: string;
};

export interface FormSubmitProps<T extends z.ZodSchema<FieldValues>> {
  schema: T;
  defaultValues: DefaultValues<z.infer<T>>; // Change to DefaultValues type
  onSubmitAction: (data: z.infer<T>) => Promise<MessageResponse>;
}

export const useFormAction = <T extends z.ZodSchema<FieldValues>>(
  props: FormSubmitProps<T>
) => {
  const { schema, defaultValues, onSubmitAction } = props;

  const form: UseFormReturn<z.infer<T>> = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues, // Now defaults are correctly typed
  });

  const [message, setMessage] = useState<FormMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (action: (data: z.infer<T>) => Promise<MessageResponse>) => {
    const setResponseMessage = (res: MessageResponse) => {
      if (res && 'success' in res) {
        setMessage({
          type: res.success ? 'success' : 'error',
          message: res?.message || '',
        });
      }
    };

    return async (data: z.infer<T>) => {
      setMessage(null);

      startTransition(() => {
        action(data)
          .then(setResponseMessage)
          .catch((error) => {
            if (isRedirectError(error)) return;
            console.error('Submission Error:', error);
            setMessage({
              type: 'error',
              message: 'Submission failed. Please try again.',
            });
          });
      });
    };
  };

  return {
    form,
    message,
    isPending,
    onSubmit: form.handleSubmit(onSubmit(onSubmitAction)),
  };
};
