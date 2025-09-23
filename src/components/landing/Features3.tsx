"use client"

import React, { memo, useCallback, useId, forwardRef, type JSX } from 'react';
import { useTheme } from 'next-themes';
import {cn, EmptyState } from "@/components/interactive-empty-state";
import { motion } from 'framer-motion';
import {
  Plus,
  GraduationCap,
  Code,
  FolderOpen,
  Palette,
  Moon,
  ShieldAlert,
  XCircle,
  Bookmark,Library,MousePointerClick,
  Sun,
  Briefcase,
  AlertCircle,
  Code2,
  Wrench,
  Zap,
  Rocket,
  TrendingUp,
  Award,
  BookOpen,
  Medal
} from 'lucide-react';

export default function EmptyStateShowcase() {

  const { resolvedTheme } = useTheme();

  interface HandleAction {
    (section: string): void;
  }

  const handleAction: HandleAction = useCallback((section: string) => {
    console.log(`Action triggered for: ${section}`);
  }, []);

  const theme = resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'neutral' ? 'neutral' : resolvedTheme === 'light' ? 'light' : undefined;

  if (!theme) return null

  interface MotionDivProps {
    delay: number;
    children: React.ReactNode;
  }

  const motionDiv = (delay: MotionDivProps['delay'], children: MotionDivProps['children']): JSX.Element => (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );

  const getSubtitleClass = () => {
    switch(theme) {
      case 'dark': return 'text-neutral-400';
      case 'neutral': return 'text-stone-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div
      className={cn(
        "font-sans px-4 sm:px-8 pb-32",
        theme === 'dark'
          ? 'bg-transparent text-neutral-100'
          : 'bg-transparent text-gray-900'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn("text-base sm:text-lg max-w-3xl mx-auto", getSubtitleClass())}
          >
            Optimized, accessible, and fully customizable empty state component with theme support.
          </motion.p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {motionDiv(0.2,
            <EmptyState
              theme={theme}
              title="No Projects Added"
              description="Showcase your work by adding personal projects, open-source contributions, or other achievements."
              icons={[<FolderOpen key="p1" className="h-6 w-6" />, <Code2 key="p2" className="h-6 w-6" />, <Rocket key="p3" className="h-6 w-6" />]}
              action={{ label: "Add Project", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Projects") }}
            />
          )}
          {motionDiv(0.2,
            <EmptyState
              theme={theme}
              title="No Projects Added"
              description="Showcase your work by adding personal projects, open-source contributions, or other achievements."
              icons={[<FolderOpen key="p1" className="h-6 w-6" />, <Code2 key="p2" className="h-6 w-6" />, <Rocket key="p3" className="h-6 w-6" />]}
              action={{ label: "Add Project", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Projects") }}
            />
          )}
          {motionDiv(0.2,
            <EmptyState
              theme={theme}
              title="No Projects Added"
              description="Showcase your work by adding personal projects, open-source contributions, or other achievements."
              icons={[<FolderOpen key="p1" className="h-6 w-6" />, <Code2 key="p2" className="h-6 w-6" />, <Rocket key="p3" className="h-6 w-6" />]}
              action={{ label: "Add Project", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Projects") }}
            />
          )}

        </main>
      </div>
    </div>
  );
}
