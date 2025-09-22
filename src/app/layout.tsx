import './globals.css';
import React from 'react';
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';


const geistSans = GeistSans;

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistSans.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">{children}</div>

        </ThemeProvider>
      </body>
    </html>
  );
}
