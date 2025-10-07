"use client"

import { useCallback } from 'react';

// ⚡ Performance: Substituído Framer Motion RAF loop por scrollIntoView nativo (100% mais eficiente)
export function useFramerScroll(offset: number = 0) {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Se offset é 0, usa scrollIntoView nativo (mais eficiente)
      if (offset === 0) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Se tem offset, calcula manualmente mas usa scrollTo nativo
        const rect = element.getBoundingClientRect();
        const targetPosition = rect.top + window.scrollY + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  }, [offset]);

  return { scrollTo };
}
