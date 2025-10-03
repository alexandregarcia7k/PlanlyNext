import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * 🧪 Configuração ESPECÍFICA para testar componentes React
 *
 * Use este arquivo quando precisar testar componentes que usam DOM:
 * vitest --config vitest.config.ui.ts
 *
 * Por padrão, use o vitest.config.ts (mais rápido, sem DOM)
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Ambiente jsdom APENAS para testes de UI
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],

    // Incluir APENAS testes de componentes
    include: ['src/components/**/*.test.{ts,tsx}'],

    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    coverage: {
      provider: 'istanbul',
      reporter: ['text'],
      include: ['src/components/**/*.{ts,tsx}'],
      exclude: [
        '**/__tests__/**',
        '**/*.stories.tsx',
        '**/*.test.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
