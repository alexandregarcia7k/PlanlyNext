"use client"

import { useCallback } from 'react';

export function useLenisScroll() {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Se Lenis estiver disponível globalmente, use-o
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.scrollTo(element, { duration: 1.2 });
      } else {
        // Fallback para scrollIntoView nativo
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, []);

  return { scrollTo };
}