'use client';
import React from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionAnimation } from '../../hooks/use-intersection-animation';

export interface BlurTitleProps {
  text: string;
  className?: string;
  color?: string;
  blurColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
  '2xl': 'text-6xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function BlurTitle({
  text,
  className,
  color = 'text-primary',
  blurColor = 'rgba(62, 62, 62, 0.3)',
  size = 'lg',
  weight = 'bold',
  delay = 0,
  threshold = 0.5,
  once = true,
}: BlurTitleProps) {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold,
    once,
  });

  return (
    <div ref={elementRef} className={cn('relative select-none', className)}>
      <span
        className={cn(
          'relative z-10 transition-all duration-1000',
          color,
          sizeClasses[size],
          weightClasses[weight],
          isVisible ? 'blur-none opacity-100' : 'blur-xl opacity-0'
        )}
        style={{
          transitionDelay: `${delay}s`,
        }}
      >
        {text}
      </span>
      <span
        className={cn(
          'absolute left-0 top-0 z-0 transition-all duration-1000',
          sizeClasses[size],
          weightClasses[weight],
          isVisible ? 'blur-lg opacity-0' : 'blur-3xl opacity-100'
        )}
        style={{
          color: blurColor,
          transitionDelay: `${delay}s`,
        }}
      >
        {text}
      </span>
    </div>
  );
}
