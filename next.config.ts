import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
      },
    ],
    // Configuração de qualidades de imagem (requerido no Next.js 16+)
    qualities: [75, 85, 90, 95, 100],
  },
  // ⚡ Performance: Força tree-shaking em bibliotecas pesadas
  experimental: {
    optimizePackageImports: [
      'lucide-react',                   // -105 KB (carrega apenas ~40 ícones de ~2000)
      'framer-motion',                  // -20 KB (carrega apenas ~8 hooks de ~50)
      '@radix-ui/react-tooltip',        // -3 KB (otimização marginal, já é bem otimizado)
      '@radix-ui/react-switch',         // -2 KB
      '@radix-ui/react-slot',           // -1 KB
      '@radix-ui/react-checkbox',       // -2 KB
      '@radix-ui/react-context-menu',   // -3 KB
      '@radix-ui/react-label',          // -2 KB
    ],
  },
  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
    }
  },
  // Headers de segurança
  async headers() {
    return [
      {
        // Aplicar a todas as rotas
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            // CSP mais restritivo - ajuste conforme necessário
            // Nota: 'unsafe-inline' e 'unsafe-eval' são necessários para Next.js e Framer Motion
            // Em produção, considere usar nonces para maior segurança
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com", // Vercel Analytics/Speed Insights
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.upstash.io https://vercel.live https://va.vercel-scripts.com wss://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
