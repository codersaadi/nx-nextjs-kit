'use client';
import React from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionAnimation } from '../../hooks/use-intersection-animation';

interface ScrollHighlightProps {
  children: React.ReactNode;
  className?: string;
  highlightColor?: string;
  highlightHeight?: 'sm' | 'md' | 'lg';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

const heightClasses = {
  sm: 'after:h-[3px]',
  md: 'after:h-[6px]',
  lg: 'after:h-[10px]',
};

export function ScrollHighlight({
  children,
  className,
  highlightColor = 'bg-primary',
  highlightHeight = 'sm',
  delay = 0,
  duration = 0.7,
  threshold = 0.5,
  once = true,
}: ScrollHighlightProps) {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold,
    once,
  });

  return (
    <div
      ref={elementRef}
      className={cn(
        'relative inline-block',
        'after:absolute after:bottom-0 after:left-0',
        'after:w-full after:origin-left',
        heightClasses[highlightHeight],
        isVisible ? 'after:scale-x-100' : 'after:scale-x-0',
        'after:transition-transform after:ease-in-out',
        className
      )}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`,
        ['--highlight-color' as string]: highlightColor,
      }}
    >
      {children}
    </div>
  );
}
