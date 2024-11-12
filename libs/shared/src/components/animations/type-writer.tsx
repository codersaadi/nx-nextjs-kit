'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionAnimation } from '../../hooks/use-intersection-animation';

interface TypeWriterProps {
  text: string | string[];
  className?: string;
  speed?: number; // ms per character
  delay?: number; // initial delay in ms
  cursor?: boolean;
  repeat?: boolean;
  threshold?: number;
  once?: boolean; // Added once prop
}

export function TypeWriter({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  repeat = false,
  threshold = 0.1,
  once = true, // Default to true
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { elementRef, isVisible } = useIntersectionAnimation({
    threshold,
    once,
  });
  const texts = Array.isArray(text) ? text : [text];

  useEffect(() => {
    if (!isVisible) {
      // Reset state when element leaves viewport (only if once is false)
      if (!once) {
        setDisplayText('');
        setCurrentIndex(0);
      }
      return;
    }

    const timeout = setTimeout(
      () => {
        const currentText = texts[currentIndex];
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else if (repeat && currentIndex < texts.length - 1) {
          setTimeout(() => {
            setDisplayText('');
            setCurrentIndex((prev) => prev + 1);
          }, 1000);
        }
      },
      displayText.length === 0 ? delay : speed
    );

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, texts, speed, delay, repeat, isVisible, once]);

  return (
    <div ref={elementRef} className={cn('font-mono', className)}>
      {displayText}
      {cursor && isVisible && <span className="animate-pulse ml-1">|</span>}
    </div>
  );
}
