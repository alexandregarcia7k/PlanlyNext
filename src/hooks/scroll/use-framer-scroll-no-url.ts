"use client"

import { useCallback, useRef } from 'react';
import { animate, AnimationPlaybackControls } from 'framer-motion';

export function useFramerScrollNoUrl() {
  const animationRef = useRef<AnimationPlaybackControls | null>(null);

  const scrollTo = useCallback((elementId: string) => {
    // Verificar se está no browser (não SSR)
    if (typeof window === 'undefined') return;

    // Cancelar animação anterior se existir
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const element = document.getElementById(elementId);
    if (!element) return;

    const targetPosition = element.offsetTop;
    const startPosition = window.scrollY;

    // Iniciar nova animação e armazenar referência
    animationRef.current = animate(startPosition, targetPosition, {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (value) => {
        window.scrollTo(0, value);
      },
      onComplete: () => {
        animationRef.current = null;
      },
    });
  }, []);

  return { scrollTo };
}
