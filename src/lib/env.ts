import { z } from 'zod';

/**
 * Schema de validação para variáveis de ambiente
 * Garante que todas as variáveis necessárias estão presentes e válidas
 */
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase (Client-side - públicas)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('URL do Supabase inválida'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'Anon key do Supabase é obrigatória'),

  // Supabase (Server-side - secretas)
  SUPABASE_URL: z.string().url('URL do Supabase inválida'),
  SUPABASE_SECRET_KEY: z.string().min(1, 'Service role key do Supabase é obrigatória'),

  // Redis/Upstash
  UPSTASH_REDIS_REST_URL: z.string().url('URL do Redis inválida'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Token do Redis é obrigatório'),

  // Email/Resend
  RESEND_API_KEY: z.string().min(1, 'API key do Resend é obrigatória'),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url('URL do site inválida').default('http://localhost:3000'),
});

/**
 * Tipo inferido do schema para ter autocomplete
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Função que valida e retorna as variáveis de ambiente
 * Lança erro se alguma variável estiver faltando ou inválida
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Erro de configuração: Variáveis de ambiente inválidas');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Configuração inválida - verifique as variáveis de ambiente');
  }

  return parsed.data;
}

/**
 * Variáveis de ambiente validadas
 * Exportadas como constante para uso em toda aplicação
 */
export const env = validateEnv();

/**
 * Helper para verificar se está em produção
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper para verificar se está em desenvolvimento
 */
export const isDevelopment = env.NODE_ENV === 'development';
