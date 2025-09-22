"use client"

import React from "react";
import { useTheme } from "next-themes";
import { EmptyState } from "@/components/interactive-empty-state";
import {
  Plus,
  GraduationCap,
  Code,
  FolderOpen,
  ShieldAlert,
  XCircle,
  Bookmark,
  Library,
  MousePointerClick,
  Briefcase,
  AlertCircle,
  Code2,
  TrendingUp,
  Award,
  BookOpen,
  Wrench,
  Zap,
  Medal,
} from "lucide-react";

export default function Features4() {
  const { theme: themeRaw } = useTheme();
  const theme = themeRaw === "dark" ? "dark" : themeRaw === "neutral" ? "neutral" : "light";

  function handleAction(type: string) {
    // Adapte para navegação ou ação real
    alert(`Ação: ${type}`);
  }

  return (
    <section className="min-h-screen font-sans p-4 sm:p-8 flex flex-col items-center justify-center">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-bold mb-2">Optimized, accessible, and fully customizable empty state component with theme support.</h2>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <EmptyState
          theme={theme}
          title="No Projects Added"
          description="Showcase your work by adding personal projects, open-source contributions, or other achievements."
          icons={[<FolderOpen key="p1" className="h-6 w-6" />, <Code2 key="p2" className="h-6 w-6" />, <Rocket key="p3" className="h-6 w-6" />]}
          action={{ label: "Add Project", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Projects") }}
        />
        <EmptyState
          theme={theme}
          size="sm"
          title="Small Size Variant"
          description="This example uses the 'sm' size prop for more compact spaces."
          icons={[<Code key="s1" className="h-6 w-6" />, <Wrench key="s2" className="h-6 w-6" />, <Zap key="s3" className="h-6 w-6" />]}
          action={{ label: "Add Skill", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Skills") }}
        />
        <EmptyState
          theme={theme}
          variant="subtle"
          title="Subtle Variant"
          description="This uses the subtle variant with minimal borders and backgrounds for a cleaner look."
          icons={[<Briefcase key="e1" className="h-6 w-6" />, <TrendingUp key="e2" className="h-6 w-6" />, <Award key="e3" className="h-6 w-6" />]}
          action={{ label: "Add Position", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Experience") }}
        />
        <EmptyState
          theme={theme}
          size="lg"
          title="Large Size"
          description="Add your degrees and academic achievements to showcase your qualifications."
          icons={[<GraduationCap key="ed1" className="h-6 w-6" />, <BookOpen key="ed2" className="h-6 w-6" />, <Medal key="ed3" className="h-6 w-6" />]}
          action={{ label: "Add Education", icon: <Plus className="h-4 w-4" />, onClick: () => handleAction("Education") }}
        />
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
        <EmptyState
          theme={theme}
          isIconAnimated={false}
          title="Static Icons"
          description="This example has animations disabled and shows a reading list state."
          icons={[<BookOpen key="rl1b" className="h-6 w-6" />, <Bookmark key="rl2b" className="h-6 w-6" />, <Library key="rl3b" className="h-6 w-6" />]}
          action={{
            label: "Explore Books",
            icon: <MousePointerClick className="h-4 w-4" />,
            onClick: () => handleAction("Explore")
          }}
        />
      </main>
    </section>
  );
}
