import disposableDomains from './disposable-domains.json';
import { logger } from '@/lib/logger';

// Import condicional de dns para funcionar em server e testes
interface MxRecord {
  exchange: string;
  priority: number;
}

let resolveMx: ((hostname: string) => Promise<MxRecord[]>) | null = null;

// Carregar DNS apenas em ambiente Node.js (server-side)
if (typeof window === 'undefined') {
  import('dns/promises')
    .then((dns) => {
      resolveMx = dns.resolveMx;
    })
    .catch((error) => {
      logger.warn('DNS module não disponível', { error });
    });
}

// Cache de domínios temporários em Set para performance O(1)
const disposableSet = new Set<string>(disposableDomains);

// Cache de verificação MX (válido por 1 hora)
const mxCache = new Map<string, { valid: boolean; timestamp: number }>();
const MX_CACHE_TTL = 3600000; // 1 hora em ms

// Domínios adicionais bloqueados (complemento à lista JSON)
const ADDITIONAL_BLOCKED_DOMAINS = [
  // Domínios suspeitos genéricos
  'example.com', 'test.com', 'localhost',
  'spam.com', 'fake.com', 'invalid.com',

  // Domínios temporários populares (backup caso JSON falhe)
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'temp-mail.org',
  'temp-mail.io', 'throwaway.email', 'maildrop.cc',
  'sharklasers.com', 'emailondeck.com', 'getnada.com',
  'mohmal.com', 'minuteinbox.com', 'fakemailgenerator.com',
];

// Emails específicos bloqueados
const BLACKLISTED_EMAILS = [
  'test@test.com', 'spam@spam.com', 'fake@fake.com',
  'admin@admin.com', 'noreply@noreply.com',
  'no-reply@example.com', 'test@example.com',
];

/**
 * Verifica se o domínio é um email temporário/descartável
 */
function isDisposableDomain(domain: string): boolean {
  const domainLower = domain.toLowerCase();

  // Verificar na lista principal (10k+ domínios)
  if (disposableSet.has(domainLower)) {
    return true;
  }

  // Verificar domínios adicionais
  if (ADDITIONAL_BLOCKED_DOMAINS.includes(domainLower)) {
    return true;
  }

  // Verificar subdomínios (ex: teste.tempmail.com)
  for (const blocked of ADDITIONAL_BLOCKED_DOMAINS) {
    if (domainLower.endsWith('.' + blocked)) {
      return true;
    }
  }

  // Verificar na lista principal também por subdomínio
  const parts = domainLower.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    const subdomain = parts.slice(i).join('.');
    if (disposableSet.has(subdomain)) {
      return true;
    }
  }

  return false;
}

/**
 * Verifica se o domínio possui registros MX (servidor de email)
 * Usa cache para não fazer lookup repetidos
 */
async function hasMXRecords(domain: string): Promise<boolean> {
  const domainLower = domain.toLowerCase();

  // Verificar se DNS está disponível
  if (!resolveMx) {
    logger.warn('DNS module não carregado, MX check desabilitado', { domain: domainLower });
    // Em ambientes onde DNS não está disponível, assumir válido
    return true;
  }

  // Verificar cache
  const cached = mxCache.get(domainLower);
  if (cached && (Date.now() - cached.timestamp) < MX_CACHE_TTL) {
    return cached.valid;
  }

  try {
    const records = await resolveMx(domainLower);
    const isValid = records && records.length > 0;

    // Armazenar no cache
    mxCache.set(domainLower, { valid: isValid, timestamp: Date.now() });

    return isValid;
  } catch (error) {
    // Se der erro (domínio não existe ou sem MX), considerar inválido
    logger.warn('Erro ao verificar MX records', { domain: domainLower, error });

    // Cache negativo (mais curto: 5 minutos)
    mxCache.set(domainLower, { valid: false, timestamp: Date.now() });

    return false;
  }
}

/**
 * Validação síncrona de email (sem MX check)
 * Usa para validações rápidas
 */
export function validateEmailSecurity(email: string): { valid: boolean; error?: string } {
  const emailLower = email.toLowerCase().trim();

  // Validação básica de formato
  if (!emailLower || !emailLower.includes('@') || emailLower.split('@').length !== 2) {
    return { valid: false, error: "Formato de email inválido" };
  }

  const [localPart, domain] = emailLower.split('@');

  // Verificar se local part e domínio existem
  if (!localPart || localPart.length === 0 || !domain || domain.length === 0) {
    return { valid: false, error: "Email incompleto" };
  }

  // Validar formato do local part (antes do @)
  if (localPart.length > 64) {
    return { valid: false, error: "Email muito longo" };
  }

  // Validar formato do domínio
  if (domain.length > 253 || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return { valid: false, error: "Domínio de email inválido" };
  }

  // Verificar emails específicos bloqueados
  if (BLACKLISTED_EMAILS.includes(emailLower)) {
    return { valid: false, error: "Este email não é permitido" };
  }

  // Verificar se é domínio temporário (BLOQUEIO RIGOROSO)
  if (isDisposableDomain(domain)) {
    return {
      valid: false,
      error: "Emails temporários não são permitidos. Use um email permanente (Gmail, Outlook, Yahoo, etc.)"
    };
  }

  return { valid: true };
}

/**
 * Validação assíncrona completa com verificação MX
 * Usa para validações mais rigorosas (ex: newsletter)
 */
export async function validateEmailSecurityWithMX(email: string): Promise<{ valid: boolean; error?: string }> {
  // Primeiro, validação síncrona
  const basicValidation = validateEmailSecurity(email);
  if (!basicValidation.valid) {
    return basicValidation;
  }

  // Extrair domínio
  const domain = email.toLowerCase().split('@')[1];

  // Verificar MX records
  const hasMX = await hasMXRecords(domain);
  if (!hasMX) {
    return {
      valid: false,
      error: "Domínio de email não existe ou não pode receber mensagens"
    };
  }

  return { valid: true };
}

// Constantes para detecção de spam
const MAX_CONSECUTIVE_DIGITS = 5;
const MIN_NAME_LENGTH = 2;
const MAX_LINKS_ALLOWED = 2;
const MIN_MESSAGE_LENGTH_FOR_CAPS_CHECK = 20;

// Verificação adicional de padrões suspeitos
export function detectSuspiciousPatterns(email: string, name: string, message: string): { suspicious: boolean; reason?: string } {
  // Validar inputs
  if (!email || typeof email !== 'string') {
    return { suspicious: false };
  }

  if (!name || typeof name !== 'string') {
    return { suspicious: false };
  }

  if (!message || typeof message !== 'string') {
    return { suspicious: false };
  }

  // Email com muitos números consecutivos
  const digitPattern = new RegExp(`\\d{${MAX_CONSECUTIVE_DIGITS},}`);
  if (digitPattern.test(email)) {
    return { suspicious: true, reason: "Email com muitos números" };
  }

  // Nome muito curto ou suspeito
  if (name.length < MIN_NAME_LENGTH || /^[a-z]+$/.test(name)) {
    return { suspicious: true, reason: "Nome suspeito" };
  }

  // Mensagem com muitos links
  const linkMatches = message.match(/https?:\/\//g);
  const linkCount = linkMatches ? linkMatches.length : 0;
  if (linkCount > MAX_LINKS_ALLOWED) {
    return { suspicious: true, reason: "Muitos links na mensagem" };
  }

  // Mensagem toda em maiúscula
  if (message.length > MIN_MESSAGE_LENGTH_FOR_CAPS_CHECK && message === message.toUpperCase()) {
    return { suspicious: true, reason: "Mensagem em maiúscula (spam)" };
  }

  return { suspicious: false };
}
