'use client';

import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const themes = [
  { key: 'system', icon: Monitor, label: 'System theme' },
  { key: 'light',  icon: Sun,     label: 'Light theme'  },
  { key: 'dark',   icon: Moon,    label: 'Dark theme'   },
];

export type ThemeSwitcherProps = { className?: string };

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={cn(
        'relative isolate inline-flex w-fit shrink-0 items-center',
        'h-8 rounded-full bg-muted/80 p-1 ring-1 ring-border shadow-sm',
        'backdrop-blur supports-[backdrop-filter]:bg-muted/60',
        'overflow-hidden', // evita qualquer bleed
        className,
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setTheme(key as 'light' | 'dark' | 'system')}
            className={cn(
              'relative grid place-items-center rounded-full transition-all duration-200',
              // VISUAL pequeno
              'size-6',
              // ÁREA de toque grande (só no mobile)
              "after:content-[''] after:absolute after:-inset-2 sm:after:content-none",
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full bg-primary shadow-md ring-1 ring-primary/20"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
              />
            )}
            <Icon
              className={cn(
                'relative z-10 h-4 w-4 transition-colors duration-200',
                // ensure sufficient contrast when the Light theme is active:
                // primary-foreground is intentionally light (white), which can be
                // invisible on light backgrounds. Prefer the base foreground color
                // for the sun (light) variant so the icon remains visible.
                isActive
                  ? (key === 'light' || (key === 'system' && resolvedTheme === 'light')
                      ? 'text-foreground'
                      : 'text-primary-foreground')
                  : 'text-muted-foreground hover:text-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
