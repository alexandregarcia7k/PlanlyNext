import { NextResponse } from 'next/server';

/**
 * Middleware do Next.js para adicionar camadas extras de segurança
 * e lógica de roteamento
 */
export function middleware() {
  const response = NextResponse.next();

  // Headers de segurança adicionais (além dos definidos em next.config.ts)
  // Nota: Alguns headers já são definidos no next.config.ts, mas podemos
  // adicionar lógica condicional aqui se necessário

  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Desabilitar cache de DNS no navegador para prevenir DNS rebinding
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // Desabilitar detecção de downloads do IE
  response.headers.set('X-Download-Options', 'noopen');

  // Configurar Permissions Policy (anteriormente Feature Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

/**
 * Configuração do matcher
 * Define em quais rotas o middleware será executado
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
