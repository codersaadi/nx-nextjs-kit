'use client';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export default function SignOutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant={'default'}
      size={'sm'}
      className={cn(
        'bg-destructive/15 z-40 text-red-500 hover:bg-red-600 hover:bg-opacity-50 hover:text-white  rounded-full  w-full'
      )}
      onClick={onClick}
    >
      Sign Out
    </Button>
  );
}
