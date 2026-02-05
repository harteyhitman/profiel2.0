'use client';

import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  start?: number;
  decimals?: number;
  enabled?: boolean;
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
): number {
  const {
    duration = 2000,
    start = 0,
    decimals = 0,
    enabled = true,
  } = options;

  const [count, setCount] = useState(start);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const endValueRef = useRef(end);

  useEffect(() => {
    endValueRef.current = end;
  }, [end]);

  useEffect(() => {
    if (!enabled) {
      setCount(endValueRef.current);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (endValueRef.current - start) * easeOutQuart;

      setCount(Number(current.toFixed(decimals)));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValueRef.current);
      }
    };

    // Reset and start animation
    setCount(start);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, start, decimals, enabled]);

  return count;
}
