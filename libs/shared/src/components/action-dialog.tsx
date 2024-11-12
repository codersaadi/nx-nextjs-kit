'use client';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useState } from 'react';

export interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  trigger?: React.ReactNode;
  onAction: () => Promise<
    | [
        (
          | {
              success: boolean;
              message: string;
              error?: undefined;
            }
          | {
              success: boolean;
              error: string;
              message?: undefined;
            }
        ),
        null
      ]
    | [
        null,
        {
          code: unknown;
          message: string;
        }
      ]
  >;
  actionLabel?: string; // Label for action button (e.g., "Delete", "Confirm")
  title?: string; // Custom title for dialog
  description?: string; // Custom description for dialog
  destructive?: boolean; // Whether the action is destructive (e.g., delete)
}

export const ActionDialog = ({
  open,
  onOpenChange,
  onSuccess,
  trigger,
  onAction,
  actionLabel = 'Confirm',
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  destructive = false,
}: ActionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, err] = await onAction(); // Execute the passed in action
      if (err) {
        setError(err.message);
        return;
      }
      if (res.success) {
        onSuccess();
        onOpenChange(false); // Close dialog on success
      } else {
        setError(
          res.message ||
            res.error ||
            'An unexpected error occurred. Please try again.'
        );
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleAction}
            disabled={loading}
          >
            {loading ? `${actionLabel}...` : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
