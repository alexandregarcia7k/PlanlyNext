/**
 * Constantes da aplicação
 * Centralize valores mágicos e configurações aqui
 */

/**
 * Rate Limiting
 */
export const RATE_LIMIT = {
  CONTACT_FORM: {
    WINDOW_SECONDS: 60, // 1 minuto
    MAX_ATTEMPTS: 1,
  },
  NEWSLETTER: {
    WINDOW_SECONDS: 300, // 5 minutos
    MAX_ATTEMPTS: 1,
  },
} as const;

/**
 * Validações de Email
 */
export const EMAIL_VALIDATION = {
  MAX_CONSECUTIVE_DIGITS: 5,
  MIN_NAME_LENGTH: 2,
  MAX_LINKS_ALLOWED: 2,
  MIN_MESSAGE_LENGTH_FOR_CAPS_CHECK: 20,
} as const;

/**
 * Timeouts e Durações
 */
export const DURATION = {
  SUCCESS_DISPLAY_MS: 3000,
  TOAST_DURATION_MS: 5000,
} as const;

/**
 * Mensagens de Erro Padronizadas
 */
export const ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Aguarde antes de enviar outra mensagem',
  SPAM_DETECTED: 'Spam detectado',
  INVALID_EMAIL: 'Email inválido',
  INTERNAL_ERROR: 'Erro interno do servidor',
  EMAIL_CONFIG_MISSING: 'Configuração de email não encontrada',
  SUPABASE_CONFIG_MISSING: 'Variáveis de ambiente do Supabase não configuradas',
  TEMPORARY_EMAIL_NOT_ALLOWED: 'Emails temporários não são permitidos',
  USE_TRUSTED_EMAIL: 'Use um email de provedor confiável (Gmail, Outlook, Yahoo, etc.)',
  EMAIL_ALREADY_SUBSCRIBED: 'Este email já está inscrito na newsletter',
  NEWSLETTER_SUBSCRIPTION_ERROR: 'Erro ao inscrever na newsletter',
} as const;

/**
 * Mensagens de Sucesso Padronizadas
 */
export const SUCCESS_MESSAGES = {
  EMAIL_SENT: 'Mensagem enviada com sucesso',
  NEWSLETTER_SUBSCRIBED: 'Inscrito na newsletter com sucesso',
} as const;

/**
 * Configurações de UI
 */
export const UI_CONFIG = {
  MAX_MOBILE_WIDTH: 768,
  MAX_TABLET_WIDTH: 1024,
  ANIMATION_DURATION: 200,
} as const;
