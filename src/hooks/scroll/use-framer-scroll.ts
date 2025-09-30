"use client"

import { useCallback } from 'react';
import { animate } from 'framer-motion';

export function useFramerScroll(offset: number = 0) {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const targetPosition = rect.top + window.scrollY + offset;
      const startPosition = window.scrollY;

      animate(startPosition, targetPosition, {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (value) => {
          window.scrollTo(0, value);
        }
      });
    }
  }, [offset]);

  return { scrollTo };
}
