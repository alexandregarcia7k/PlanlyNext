"use client"

import React, { memo, useCallback, useId, forwardRef } from 'react';
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
  // Sincroniza com o ThemeSwitcher global
  const { theme: themeRaw } = useTheme();
  // O EmptyState espera 'light', 'dark' ou 'neutral'.
  const theme = themeRaw === 'dark' ? 'dark' : themeRaw === 'neutral' ? 'neutral' : 'light';

  interface HandleAction {
    (section: string): void;
  }

  const handleAction: HandleAction = useCallback((section: string) => {
    console.log(`Action triggered for: ${section}`);
  }, []);

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

  const getBackgroundClass = () => {
    switch(theme) {
      case 'dark': return 'bg-neutralslate-950';
      case 'neutral': return 'bg-stone-100';
      default: return 'bg-gray-100';
    }
  };

  const getTitleClass = () => {
    switch(theme) {
      case 'dark': return 'text-neutral-100';
      case 'neutral': return 'text-stone-900';
      default: return 'text-gray-900';
    }
  };

  const getSubtitleClass = () => {
    switch(theme) {
      case 'dark': return 'text-neutral-400';
      case 'neutral': return 'text-stone-600';
      default: return 'text-gray-600';
    }
  };

  const getFooterClass = () => {
    switch(theme) {
      case 'dark': return 'text-neutral-500';
      case 'neutral': return 'text-stone-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen font-sans p-4 sm:p-8",
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

          {motionDiv(0.3,
            <EmptyState
              theme={theme}
              size="sm"
              title="Small Size Variant"
              description="This example uses the 'sm' size prop for more compact spaces."
              icons={[<Code key="s1" className="h-6 w-6" />, <Wrench key="s2" className="h-6 w-6" />, <Zap key="s3" className="h-6 w-6" />]}
              action={{ label: "Add Skill", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Skills") }}
            />
          )}

          {motionDiv(0.4,
            <EmptyState
              theme={theme}
              variant="subtle"
              title="Subtle Variant"
              description="This uses the subtle variant with minimal borders and backgrounds for a cleaner look."
              icons={[<Briefcase key="e1" className="h-6 w-6" />, <TrendingUp key="e2" className="h-6 w-6 border-none" />, <Award key="e3" className="h-6 w-6 border-none" />]}
              action={{ label: "Add Position", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Experience") }}
            />
          )}

          {motionDiv(0.5,
            <EmptyState
              theme={theme}
              size="lg"
              title="Large Size"
              description="Add your degrees and academic achievements to showcase your qualifications."
              icons={[<GraduationCap key="ed1" className="h-6 w-6" />, <BookOpen key="ed2" className="h-6 w-6" />, <Medal key="ed3" className="h-6 w-6" />]}
              action={{ label: "Add Education", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Education") }}
            />
          )}

          {motionDiv(0.7,
            <EmptyState
              theme={theme}
              isIconAnimated={false}
              title="Static Icons"
              description="This example has animations disabled and shows a reading list state."
              icons={[<BookOpen key="rl1" className="h-6 w-6" />, <Bookmark key="rl2" className="h-6 w-6" />, <Library key="rl3" className="h-6 w-6" />]}
              action={{
                label: "Explore Books",
                icon: <MousePointerClick className="h-4 w-4" />,
                onClick: () => handleAction("Explore")
              }}
            />
          )}
              {motionDiv(0.5,
            <EmptyState
              theme={theme}
              size="lg"
              title="Large Size"
              description="Add your degrees and academic achievements to showcase your qualifications."
              icons={[<GraduationCap key="ed1" className="h-6 w-6" />, <BookOpen key="ed2" className="h-6 w-6" />, <Medal key="ed3" className="h-6 w-6" />]}
              action={{ label: "Add Education", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Education") }}
            />
          )}


        </main>
      </div>
    </div>
  );
}
