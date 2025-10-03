/**
 * Utilitários de segurança para proteção contra SQL Injection
 * e outras vulnerabilidades
 */

/**
 * Lista de padrões SQL perigosos
 */
const SQL_INJECTION_PATTERNS = [
  // Comandos SQL básicos
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,

  // Union attacks
  /(\bUNION\b.*\bSELECT\b)/gi,

  // Comentários SQL
  /(--|\/\*|\*\/|#)/g,

  // Aspas e escape sequences
  /(['"`;\\])/g,

  // Funções SQL perigosas
  /(\b(CAST|CONVERT|CHAR|ASCII|SUBSTRING|WAITFOR|DELAY)\b)/gi,

  // Hex encoding
  /(0x[0-9A-Fa-f]+)/g,
];

/**
 * Padrões XSS (Cross-Site Scripting)
 */
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, etc.
];

/**
 * Valida se uma string contém padrões de SQL injection
 */
export function containsSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Criar novos regex para cada teste para evitar problemas com flags globais
  return SQL_INJECTION_PATTERNS.some(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags);
    return regex.test(input);
  });
}

/**
 * Valida se uma string contém padrões de XSS
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Criar novos regex para cada teste para evitar problemas com flags globais
  return XSS_PATTERNS.some(pattern => {
    const regex = new RegExp(pattern.source, pattern.flags);
    return regex.test(input);
  });
}

/**
 * Sanitiza uma string removendo caracteres perigosos
 * Útil para campos de texto livre
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remover nullbytes
  let sanitized = input.replace(/\0/g, '');

  // Remover caracteres de controle perigosos
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim e normalizar espaços
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Valida email de forma mais rigorosa
 * Complementa a validação do Zod
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Regex mais rigoroso para email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Validações adicionais
  const [localPart, domain] = email.split('@');

  // Local part não pode começar ou terminar com ponto
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  // Local part não pode ter pontos consecutivos
  if (localPart.includes('..')) {
    return false;
  }

  // Domínio deve ter pelo menos um ponto
  if (!domain.includes('.')) {
    return false;
  }

  // Domínio não pode ter caracteres SQL perigosos
  if (containsSQLInjection(domain)) {
    return false;
  }

  return true;
}

/**
 * Valida e sanitiza dados de formulário
 */
export interface FormSecurityResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export function validateFormField(
  field: string,
  value: string,
  options: {
    maxLength?: number;
    minLength?: number;
    allowHTML?: boolean;
    checkSQL?: boolean;
    checkXSS?: boolean;
  } = {}
): FormSecurityResult {
  const {
    maxLength = 1000,
    minLength = 0,
    allowHTML = false,
    checkSQL = true,
    checkXSS = true,
  } = options;

  // Validação básica
  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      error: `Campo ${field} é obrigatório`,
    };
  }

  // Verificar tamanho
  if (value.length < minLength) {
    return {
      valid: false,
      error: `Campo ${field} deve ter no mínimo ${minLength} caracteres`,
    };
  }

  if (value.length > maxLength) {
    return {
      valid: false,
      error: `Campo ${field} deve ter no máximo ${maxLength} caracteres`,
    };
  }

  // Sanitizar
  const sanitized = sanitizeInput(value);

  // Verificar SQL injection
  if (checkSQL && containsSQLInjection(sanitized)) {
    return {
      valid: false,
      error: `Campo ${field} contém caracteres não permitidos`,
    };
  }

  // Verificar XSS
  if (checkXSS && !allowHTML && containsXSS(sanitized)) {
    return {
      valid: false,
      error: `Campo ${field} contém conteúdo não permitido`,
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida objeto completo de formulário
 */
export function validateFormData<T extends Record<string, string | number | boolean>>(
  data: T,
  rules: Record<keyof T, Parameters<typeof validateFormField>[2]>
): { valid: boolean; errors: Record<string, string>; sanitized: Partial<T> } {
  const errors: Record<string, string> = {};
  const sanitized: Partial<T> = {};

  for (const [field, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      const rule = rules[field as keyof T];
      const result = validateFormField(field, value, rule);

      if (!result.valid) {
        errors[field] = result.error!;
      } else if (result.sanitized) {
        sanitized[field as keyof T] = result.sanitized as T[keyof T];
      }
    } else {
      // Para valores não-string, apenas copiar
      (sanitized[field as keyof T] as string | number | boolean | undefined) = value;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}
