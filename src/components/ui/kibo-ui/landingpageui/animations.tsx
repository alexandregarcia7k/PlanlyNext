'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import React from 'react';

// ============================================
// ANIMATION VARIANTS
// ============================================

export const animationVariants = {
  // Variantes para entrada com blur (Hero)
  heroImageEntrance: {
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

  // Variantes para entrada suave (Features)
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

  // Variantes para entrada com blur (Features)
  featuresImage: {
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
};

// ============================================
// CUSTOM HOOKS
// ============================================

export const useScrollTilt = (ref: React.RefObject<HTMLDivElement>) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Mapeamento das rotações
  const rawRotateY = useTransform(scrollYProgress, [0, 0.5, 1], ['-25deg', '0deg', '25deg']);
  const rawRotateX = useTransform(scrollYProgress, [0, 0.5, 1], ['8deg', '0deg', '-8deg']);

  // Efeito de escala
  const rawScale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.85, 0.95, 1.1, 0.95, 0.85]);

  // Controle da máscara
  const maskOpacity = useTransform(scrollYProgress, [0, 0.25, 0.4, 0.6, 0.75, 1], [0.7, 0.4, 0.1, 0.1, 0.4, 0.7]);

  // Springs para suavização
  const rotateY = useSpring(rawRotateY, { damping: 35, stiffness: 120 });
  const rotateX = useSpring(rawRotateX, { damping: 35, stiffness: 120 });
  const scale = useSpring(rawScale, { damping: 35, stiffness: 120 });

  return {
    scrollYProgress,
    rotateY,
    rotateX,
    scale,
    maskOpacity,
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
  variant?: 'hero' | 'features';
}

export const ScrollTiltImage: React.FC<ScrollTiltImageProps> = ({
  children,
  className,
  variant = 'features'
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { rotateY, rotateX, scale, maskOpacity } = useScrollTilt(ref as React.RefObject<HTMLDivElement>);

  const entranceVariant = variant === 'hero'
    ? animationVariants.heroImageEntrance
    : animationVariants.featuresImage;

  return (
    <motion.div
      ref={ref}
      className={className}
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
