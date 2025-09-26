"use client"

import { useCallback } from 'react';

type LenisWindow = Window & {
  lenis?: {
    scrollTo: (element: HTMLElement, options?: { duration?: number }) => void;
  };
};

export function useLenisScroll() {
  const scrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Se Lenis estiver disponível globalmente, use-o
      if (typeof window !== 'undefined' && (window as LenisWindow).lenis) {
        (window as LenisWindow).lenis!.scrollTo(element, { duration: 1.2 });
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