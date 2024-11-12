'use client';

import { cn } from '@org/shared/lib/utils';
import { useCallback, useState } from 'react';

interface ShinyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ShinyCard({ children, className, ...props }: ShinyCardProps) {
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = () => setHoverPos(null);

  return (
    <div
      className={cn(
        'p-6 bg-neutral-800/80 rounded-xl shadow-md transition-all duration-300 transform-gpu hover:shadow-lg',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: hoverPos
            ? `radial-gradient(circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(255, 255, 255, 0.08), transparent 70%)`
            : 'none',
        }}
      />
      {children}
    </div>
  );
}
