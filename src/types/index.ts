/**
 * Tipos compartilhados da aplicação
 */

/**
 * Resposta padrão de Server Actions
 */
export type ActionResponse<T = void> = {
  success: true;
  data?: T;
} | {
  success: false;
  error: string;
};

/**
 * Estado de formulário genérico
 */
export interface FormState {
  success: boolean;
  error?: string;
}

/**
 * Dados do formulário de contato
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Dados do formulário de newsletter
 */
export interface NewsletterFormData {
  email: string;
}

/**
 * Informações de rate limiting
 */
export interface RateLimitInfo {
  blocked: boolean;
  error?: string;
  remainingTime?: number;
}

/**
 * Resultado de validação de email
 */
export interface EmailValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Resultado de detecção de padrões suspeitos
 */
export interface SuspiciousPatternResult {
  suspicious: boolean;
  reason?: string;
}

/**
 * Metadata de notas (quando implementadas)
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

/**
 * Metadata de tarefas (quando implementadas)
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
