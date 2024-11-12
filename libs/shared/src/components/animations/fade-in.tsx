'use client';
import React from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionAnimation } from '../../hooks/use-intersection-animation';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 20,
  threshold = 0.1,
  once = true,
}: FadeInProps) {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold,
    once,
  });

  const directionStyles = {
    up: `translate-y-[${distance}px]`,
    down: `translate-y-[-${distance}px]`,
    left: `translate-x-[${distance}px]`,
    right: `translate-x-[-${distance}px]`,
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'relative',
        isVisible && 'animate-in fade-in',
        directionStyles[direction],
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
