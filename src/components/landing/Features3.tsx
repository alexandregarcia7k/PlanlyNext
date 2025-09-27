"use client"

import React, { memo, useCallback, useId, forwardRef, type JSX } from 'react';
import { useTheme } from 'next-themes';
import {cn, EmptyState } from "@/components/ui/kibo-ui/landingpageui/interactive-empty-state";
import { motion } from 'framer-motion';
import {
  Plus,
  FolderOpen,
  MousePointerClick,
  TrendingUp,
  BookOpen,
  SquareKanban,
  ListChecks,
  AlarmClockCheck,
  Calculator,
  NotebookTabs
} from 'lucide-react';
import { toast } from 'sonner';

export default function EmptyStateShowcase() {

  const [mounted, setMounted] = React.useState(false);
  const { resolvedTheme } = useTheme();
  const handleAction: HandleAction = useCallback((section: string) => {
    console.log(`Action triggered for: ${section}`);
  }, []);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Evita hydration mismatch usando tema padrão
  const theme = resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'neutral' ? 'neutral' : 'light';

  interface HandleAction {
    (section: string): void;
  }

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
    <section
      id="features3"
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
            Otimizado, acessível e repleto de funcionalidades para transformar sua rotina.
          </motion.p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {motionDiv(0.2,
            <EmptyState
              theme={theme}
              title="Organização Visual"
              description="Gerencie tarefas, projetos e ideias com quadros Kanban, listas e categorias personalizadas."
              icons={[<SquareKanban key="k1" className="h-6 w-6" />, <FolderOpen key="k2" className="h-6 w-6" />, <ListChecks key="k3" className="h-6 w-6" />]}
              action={{ label: "Explorar Kanban", icon: <Plus className="h-4 w-4" />, onClick: () => toast.error("Não disponível.", {
                description: "Esse recurso ainda não está disponível.",
                action: {
                  label: "OK",
                  onClick: () => { /* Ação adicional se necessário */ }
                }
              }) }}
            />
          )}
          {motionDiv(0.3,
            <EmptyState
              theme={theme}
              title="Foco e Eficiência"
              description="Utilize Timer Pomodoro, calculadoras e ferramentas de análise para aumentar sua produtividade e manter o foco."
              icons={[<AlarmClockCheck key="t1" className="h-6 w-6" />, <Calculator key="t2" className="h-6 w-6" />, <TrendingUp key="t3" className="h-6 w-6" />]}
              action={{ label: "Iniciar Pomodoro", icon: <Plus className="h-4 w-4" />, onClick: () => toast.error("Não disponível.", {
                description: "Esse recurso ainda não está disponível.",
                action: {
                  label: "OK",
                  onClick: () => { /* Ação adicional se necessário */ }
                }
              }) }}
            />
          )}
          {motionDiv(0.4,
            <EmptyState
              theme={theme}
              title="Anotações Inteligentes"
              description="Crie, edite e compartilhe notas, links e insights de forma rápida e integrada ao seu fluxo de trabalho."
              icons={[<NotebookTabs key="n1" className="h-6 w-6" />, <BookOpen key="n2" className="h-6 w-6" />, <MousePointerClick key="n3" className="h-6 w-6" />]}
              action={{ label: "Nova Nota", icon: <Plus className="h-4 w-4" />, onClick: () => toast.error("Não disponível.", {
                description: "Esse recurso ainda não está disponível.",
                action: {
                  label: "OK",
                  onClick: () => { /* Ação adicional se necessário */ }
                }
              }) }}
            />
          )}
        </main>
      </div>
    </section>
  );
}
