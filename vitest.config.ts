import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Carregar .env.local para testes
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    test: {
      // 🚀 OTIMIZAÇÃO 1: Use 'node' por padrão (10x mais rápido)
      // Só use jsdom quando realmente precisar testar componentes React
      environment: 'node',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],

      // Injetar variáveis de ambiente nos testes
      env,

    // 🚀 OTIMIZAÇÃO 2: Executar testes em paralelo
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },

    coverage: {
      // 🚀 OTIMIZAÇÃO 4: Usar istanbul (mais rápido que v8)
      provider: 'istanbul',

      // 🚀 OTIMIZAÇÃO 5: Apenas relatório de texto no terminal
      reporter: ['text'],

      // 🚀 OTIMIZAÇÃO 6: Incluir APENAS o que você quer testar
      include: [
        'src/lib/**/*.{ts,tsx}',
        'src/server/**/*.{ts,tsx}',
      ],

      // 🚀 OTIMIZAÇÃO 7: Excluir tudo que não precisa
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        'coverage/',
        '__document__/',
        'public/',
        'vitest.setup.ts',
        '**/*.config.{ts,js,mjs}',
        '**/*.d.ts',
        '**/types/**',
        '**/__tests__/**',
        '**/test/**',
        // Excluir componentes React (teste depois, separadamente)
        'src/components/**',
        'src/app/**',
        'src/hooks/**',
        'src/styles/**',
      ],

      // 🚀 OTIMIZAÇÃO 8: Não processar arquivos que não mudaram
      cleanOnRerun: true,
    },
  },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
