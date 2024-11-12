'use client';
import React from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionAnimation } from '../../hooks/use-intersection-animation';

type AnimationType = {
  fade?: boolean;
  blur?: 'sm' | 'md' | 'lg';
  slide?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  duration?: number;
  delay?: number;
};

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: AnimationType | AnimationType[];
  once?: boolean;
  threshold?: number;
  asChild?: boolean;
}

export function AnimatedContainer({
  children,
  animation = { fade: true },
  className,
  once = true,
  threshold = 0.1,
  ...props
}: AnimatedContainerProps) {
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold,
    once,
  });
  const animations = Array.isArray(animation) ? animation : [animation];

  // Helper function to get animation classes
  const getAnimationClasses = (anim: AnimationType, visible: boolean) => {
    const classes: string[] = [];
    const duration = anim.duration ?? 700;
    const delay = anim.delay ?? 0;

    // Base transition class using style property instead
    classes.push('transition-all');
    const style = {
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
    };

    if (!visible) {
      // Initial state classes
      if (anim.fade) classes.push('opacity-0');
      if (anim.blur) classes.push(`blur-${anim.blur}`);
      if (anim.scale) classes.push(`scale-${anim.scale}`);

      // Slide translations
      if (anim.slide === 'up') classes.push('translate-y-8');
      if (anim.slide === 'down') classes.push('-translate-y-8');
      if (anim.slide === 'left') classes.push('translate-x-8');
      if (anim.slide === 'right') classes.push('-translate-x-8');
    } else {
      // Visible state classes
      if (anim.fade) classes.push('opacity-100');
      if (anim.blur) classes.push('blur-none');
      if (anim.scale) classes.push('scale-100');
      if (anim.slide) classes.push('translate-x-0 translate-y-0');
    }

    return { classes, style };
  };

  const animationClasses = animations.flatMap((anim) =>
    getAnimationClasses(anim, isVisible)
  );

  return (
    <div
      ref={elementRef}
      className={cn(animationClasses.map((a) => a.classes).flat(), className)}
      style={Object.assign({}, ...animationClasses.map((a) => a.style))}
      {...props}
    >
      {children}
    </div>
  );
}
