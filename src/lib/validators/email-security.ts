// Domínios confiáveis permitidos
const ALLOWED_DOMAINS = [
  // Principais provedores
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.com.br',
  'icloud.com', 'me.com', 'mac.com',
  
  // Provedores brasileiros
  'uol.com.br', 'bol.com.br', 'terra.com.br',
  'ig.com.br', 'r7.com', 'globo.com',
  
  // Empresariais comuns
  'company.com', 'corp.com', 'enterprise.com',
  
  // Educacionais
  'edu', 'edu.br', 'ac.uk', 'edu.au'
];

// Domínios temporários/suspeitos bloqueados
const BLACKLISTED_DOMAINS = [
  // Emails temporários
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'temp-mail.org',
  'throwaway.email', 'maildrop.cc', 'sharklasers.com',
  
  // Domínios suspeitos
  'example.com', 'test.com', 'localhost',
  'spam.com', 'fake.com', 'invalid.com'
];

// Emails específicos bloqueados
const BLACKLISTED_EMAILS = [
  'test@test.com', 'spam@spam.com', 'fake@fake.com',
  'admin@admin.com', 'noreply@noreply.com'
];

export function validateEmailSecurity(email: string): { valid: boolean; error?: string } {
  const emailLower = email.toLowerCase();
  const domain = emailLower.split('@')[1];
  
  // Verificar emails específicos bloqueados
  if (BLACKLISTED_EMAILS.includes(emailLower)) {
    return { valid: false, error: "Este email não é permitido" };
  }
  
  // Verificar domínios bloqueados
  if (BLACKLISTED_DOMAINS.some(blocked => domain.includes(blocked))) {
    return { valid: false, error: "Emails temporários não são permitidos" };
  }
  
  // Verificar se é domínio confiável
  const isAllowed = ALLOWED_DOMAINS.some(allowed => {
    return domain === allowed || domain.endsWith('.' + allowed);
  });
  
  if (!isAllowed) {
    return { 
      valid: false, 
      error: "Use um email de provedor confiável (Gmail, Outlook, Yahoo, etc.)" 
    };
  }
  
  return { valid: true };
}

// Verificação adicional de padrões suspeitos
export function detectSuspiciousPatterns(email: string, name: string, message: string): { suspicious: boolean; reason?: string } {
  // Email com muitos números
  if (/\d{5,}/.test(email)) {
    return { suspicious: true, reason: "Email com muitos números" };
  }
  
  // Nome muito curto ou suspeito
  if (name.length < 2 || /^[a-z]+$/.test(name)) {
    return { suspicious: true, reason: "Nome suspeito" };
  }
  
  // Mensagem com muitos links
  const linkCount = (message.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return { suspicious: true, reason: "Muitos links na mensagem" };
  }
  
  // Mensagem toda em maiúscula
  if (message.length > 20 && message === message.toUpperCase()) {
    return { suspicious: true, reason: "Mensagem em maiúscula (spam)" };
  }
  
  return { suspicious: false };
}