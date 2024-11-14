import { cn } from '@org/shared/lib/utils';
export function AnimatedLoading({ className }: { className?: string }) {
  return (
    <div className={cn(`flex items-center space-x-2`, className)}>
      <div className="w-2 h-2 rounded-full bg-foreground animate-blur-text [animation-delay:-0.3s] [animation-duration:1.5s]" />
      <div className="w-2 h-2 rounded-full bg-foreground animate-blur-text [animation-delay:-0.15s] [animation-duration:1.5s]" />
      <div className="w-2 h-2 rounded-full bg-foreground animate-blur-text [animation-duration:1.5s]" />
    </div>
  );
}
