import './globals.css';
import React from 'react';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/kibo-ui/landingpageui/sonner';


const geistSans = GeistSans;

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <title>Planly - Organize suas ideias e tarefas</title>
        <meta name="description" content="Planly: organize notas, tarefas e projetos de forma simples, intuitiva e segura. Produtividade sem esforço." />
        <meta name="keywords" content="produtividade, organização, notas, tarefas, kanban, agenda, planly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </head>
      <body className={geistSans.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
