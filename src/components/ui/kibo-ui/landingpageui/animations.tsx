'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React from 'react';

// ============================================
// ANIMATION VARIANTS
// ============================================

export const animationVariants = {
  // Variante unificada para entrada com blur (usado em Hero e Features)
  imageEntrance: {
    container: {
      visible: {
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.75,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        y: 60,
        filter: 'blur(20px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          type: 'spring' as const,
          bounce: 0.15,
          duration: 1.8,
        },
      },
    },
    // Versão simples (sem container) para Features
    hidden: {
      opacity: 0,
      y: 60,
      filter: 'blur(20px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
    },
  },

  // Variantes para texto simples (Hero)
  heroText: {
    item: {
      hidden: {
        opacity: 0,
        filter: 'blur(12px)',
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
          type: 'spring' as const,
          bounce: 0.3,
          duration: 1.5,
        },
      },
    },
  },

  // Variantes para texto simples (Features)
  featuresText: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
};

// ============================================
// CUSTOM HOOKS
// ============================================

// ⚡ Performance: Reduzido complexidade - removido rotateX, mantido rotateY + scale, apenas 2 springs
export const useScrollTilt = (ref: React.RefObject<HTMLDivElement>) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Mapeamento da rotação Y (mantido para efeito 3D)
  const rawRotateY = useTransform(scrollYProgress, [0, 0.5, 1], ['-15deg', '0deg', '15deg']); // Reduzido de 25deg para 15deg

  // Efeito de escala (simplificado)
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.90, 1.05, 0.90]); // Simplificado de 5 pontos para 3

  // Springs para suavização (apenas 2 em vez de 3)
  const rotateY = useSpring(rawRotateY, { damping: 35, stiffness: 120 });
  const scale = useSpring(rawScale, { damping: 35, stiffness: 120 });

  return {
    scrollYProgress,
    rotateY,
    rotateX: '0deg', // ⚡ Performance: rotateX removido, retorna valor estático
    scale,
  };
};

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitionPresets = {
  spring: {
    type: 'spring' as const,
    bounce: 0.3,
    duration: 1.5,
  },

  springSmooth: {
    type: 'spring' as const,
    bounce: 0.15,
    duration: 1.8,
  },

  easeOut: {
    duration: 0.6,
    ease: "easeOut" as const,
  },
};

// ============================================
// ANIMATION COMPONENTS
// ============================================

interface AnimatedElementProps {
  children: React.ReactNode;
  variant?: keyof typeof animationVariants;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  variant = 'featuresText',
  delay = 0,
  className,
  style,
}) => {
  const variants = animationVariants[variant];

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      transition={{
        ...transitionPresets.easeOut,
        delay,
      }}
      viewport={{ once: true, margin: "-50px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

interface ScrollTiltImageProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollTiltImage: React.FC<ScrollTiltImageProps> = ({
  children,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { rotateY, rotateX, scale } = useScrollTilt(ref as React.RefObject<HTMLDivElement>);

  // Usa a variant unificada imageEntrance
  const entranceVariant = animationVariants.imageEntrance;

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateY,
        rotateX,
        scale,
        transformStyle: 'preserve-3d'
      }}
      initial="hidden"
      whileInView="visible"
      transition={transitionPresets.springSmooth}
      viewport={{ once: true, margin: "-100px" }}
      variants={entranceVariant}
    >

      {children}
    </motion.div>
  );
};
