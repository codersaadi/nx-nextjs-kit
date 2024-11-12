'use client';
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionAnimationProps {
  threshold?: number;
  once?: boolean;
}

export function useIntersectionAnimation({
  threshold = 0.1,
  once = true,
}: UseIntersectionAnimationProps = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        // If once is true and element is intersecting, disconnect the observer
        if (once && isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, once]);

  return { elementRef, isVisible };
}
