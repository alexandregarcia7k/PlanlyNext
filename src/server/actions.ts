"use server";

import { Resend } from "resend";
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { headers } from "next/headers";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { redis } from "@/lib/redis";
import { RATE_LIMIT, ERROR_MESSAGES } from "@/lib/constants";
import { contactSchema } from "@/lib/validators/contact";
import { validateEmailSecurity, validateEmailSecurityWithMX, detectSuspiciousPatterns } from "@/lib/validators/email-security";
import { escapeHtml, nlToBr } from "@/lib/utils/html-escape";
import { containsSQLInjection, containsXSS, sanitizeInput } from "@/lib/security";
import type { ActionResponse } from "@/types";

// Utilitários
function createErrorResponse(error: string): ActionResponse {
  return { success: false, error };
}

function createSuccessResponse(): ActionResponse {
  return { success: true };
}

function createSupabaseClient() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    db: { schema: 'api' },
    auth: { autoRefreshToken: false, persistSession: false }
  });
}


const newsletterSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
});

export async function sendContactEmail(formData: FormData): Promise<ActionResponse> {
  let ip = "unknown"; // Declarado fora do try para uso no catch

  try {
    // Rate limiting com Redis
    const headersList = await headers();
    ip = headersList.get("x-forwarded-for") || "unknown";
    const RateLimitKey = `contact_rate_limit_${ip}`;

    const rateLimitResult = await redis.checkRateLimit(RateLimitKey);
    if (rateLimitResult.blocked) {
      return createErrorResponse(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    // Honeypot anti-spam
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      return createErrorResponse(ERROR_MESSAGES.SPAM_DETECTED);
    }


    // Extrair dados brutos
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // ✅ PROTEÇÃO PRÉVIA: Verificar SQL Injection e XSS antes de validar
    for (const [field, value] of Object.entries(rawData)) {
      if (typeof value === 'string') {
        if (containsSQLInjection(value)) {
          logger.error('Tentativa de SQL Injection detectada', {
            field,
            ip,
            length: value.length,
          });
          return createErrorResponse(`Campo ${field} contém caracteres não permitidos`);
        }

        if (containsXSS(value)) {
          logger.error('Tentativa de XSS detectada', {
            field,
            ip,
            length: value.length,
          });
          return createErrorResponse(`Campo ${field} contém conteúdo não permitido`);
        }
      }
    }

    // Sanitizar inputs
    const sanitizedData = {
      name: sanitizeInput(rawData.name),
      email: sanitizeInput(rawData.email),
      subject: sanitizeInput(rawData.subject),
      message: sanitizeInput(rawData.message),
    };

    // Validação com Zod (após sanitização)
    const validationResult = contactSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error.issues[0].message);
    }

    const { name, email, subject, message } = validationResult.data;

    // ✅ PROTEÇÃO 1: Validação rigorosa de email (síncrona)
    // Bloqueia 10.000+ domínios temporários
    const emailSecurity = validateEmailSecurity(email);
    if (!emailSecurity.valid) {
      logger.warn('Email bloqueado pela validação de segurança', {
        email: email.split('@')[1], // Log apenas domínio (não o email completo)
        reason: emailSecurity.error,
        ip,
      });
      return createErrorResponse(emailSecurity.error ?? "Email inválido");
    }

    // ✅ PROTEÇÃO 2: Detecção de padrões suspeitos (anti-spam)
    const suspiciousCheck = detectSuspiciousPatterns(email, name, message);
    if (suspiciousCheck.suspicious) {
      logger.warn('Padrão suspeito detectado no formulário', {
        reason: suspiciousCheck.reason,
        ip,
      });
      return createErrorResponse(ERROR_MESSAGES.SPAM_DETECTED);
    }

    // ✅ PROTEÇÃO 3: Validação com MX records (assíncrona)
    // Verifica se o domínio realmente pode receber emails
    const mxValidation = await validateEmailSecurityWithMX(email);
    if (!mxValidation.valid) {
      logger.warn('Email bloqueado por falha na verificação MX', {
        email: email.split('@')[1],
        reason: mxValidation.error,
        ip,
      });
      return createErrorResponse(
        mxValidation.error ?? "Domínio de email inválido ou não pode receber mensagens"
      );
    }

    const resend = new Resend(env.RESEND_API_KEY);

    // Sanitizar dados
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = nlToBr(message);
    const safeIp = escapeHtml(ip);

    const emailHtml =
      '<h2>Nova mensagem de contato</h2>\n' +
      '<p><strong>Nome:</strong> ' + safeName + '</p>\n' +
      '<p><strong>Email:</strong> ' + safeEmail + '</p>\n' +
      '<p><strong>Assunto:</strong> ' + safeSubject + '</p>\n' +
      '<p><strong>Mensagem:</strong></p>\n' +
      '<p>' + safeMessage + '</p>\n' +
      '<hr>\n' +
      '<p><small>IP: ' + safeIp + '</small></p>';

    await resend.emails.send({
      from: "contato@planly.space",
      to: "suggestions@planly.space",
      subject: "[Planly] " + safeSubject,
      html: emailHtml,
    });

    await redis.setRateLimit(RateLimitKey, RATE_LIMIT.CONTACT_FORM.WINDOW_SECONDS);
    return createSuccessResponse();
  } catch (error) {
    logger.error('Erro ao enviar email de contato',
      error, {
      context: `sendContactEmail`,
      ip
    });
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR);
  }
}

export async function subscribeNewsletter(formData: FormData): Promise<ActionResponse> {
  let ip = "unknown";

  try {
    // Rate limiting por IP
    const headersList = await headers();
    ip = headersList.get("x-forwarded-for") || "unknown";
    const ipRateLimitKey = `newsletter_ip_${ip}`;

    const ipLimit = await redis.checkRateLimit(ipRateLimitKey);
    if (ipLimit.blocked) {
      logger.warn('Newsletter rate limit por IP excedido', { ip });
      return createErrorResponse(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    // Validação básica com Zod
    const rawData = { email: formData.get("email") as string };
    const validationResult = newsletterSchema.safeParse(rawData);

    if (!validationResult.success) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_EMAIL);
    }

    const { email } = validationResult.data;

    // ✅ PROTEÇÃO 1: Validação rigorosa de email
    // Bloqueia 10.000+ domínios temporários
    const emailSecurity = validateEmailSecurity(email);
    if (!emailSecurity.valid) {
      logger.warn('Email temporário bloqueado na newsletter', {
        domain: email.split('@')[1],
        reason: emailSecurity.error,
        ip,
      });
      return createErrorResponse(
        emailSecurity.error ?? "Email inválido"
      );
    }

    // ✅ PROTEÇÃO 2: Rate limiting por email
    // Previne múltiplas tentativas com o mesmo email
    const emailRateLimitKey = `newsletter_email_${email}`;
    const emailLimit = await redis.checkRateLimit(emailRateLimitKey);
    if (emailLimit.blocked) {
      logger.warn('Newsletter rate limit por email excedido', {
        domain: email.split('@')[1],
        ip
      });
      return createErrorResponse(
        'Este email já foi cadastrado recentemente. Aguarde alguns minutos.'
      );
    }

    // ✅ PROTEÇÃO 3: Validação com MX records (assíncrona)
    // Verifica se o domínio realmente existe e pode receber emails
    const mxValidation = await validateEmailSecurityWithMX(email);
    if (!mxValidation.valid) {
      logger.warn('Email bloqueado por falha MX na newsletter', {
        domain: email.split('@')[1],
        reason: mxValidation.error,
        ip,
      });
      return createErrorResponse(
        mxValidation.error ?? "Domínio de email inválido"
      );
    }

    // ✅ PROTEÇÃO 4: Sanitização para prevenir SQL Injection
    // Supabase já usa prepared statements, mas sanitizamos por segurança
    const sanitizedEmail = email.toLowerCase().trim();

    // Validação extra: verificar se não contém caracteres SQL perigosos
    if (/[;'"`\\]/.test(sanitizedEmail)) {
      logger.error('Tentativa de SQL injection detectada', {
        ip,
        suspicious: sanitizedEmail,
      });
      return createErrorResponse(ERROR_MESSAGES.INVALID_EMAIL);
    }

    // Inserir no banco de dados
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .insert([{ email: sanitizedEmail }]);

    if (error) {
      // Duplicate key (email já cadastrado)
      if (error.code === '23505') {
        return createErrorResponse(ERROR_MESSAGES.EMAIL_ALREADY_SUBSCRIBED);
      }

      // Outros erros
      logger.error('Erro ao inserir na newsletter', error, {
        context: 'subscribeNewsletter',
        errorCode: error.code,
        ip,
      });
      return createErrorResponse(ERROR_MESSAGES.NEWSLETTER_SUBSCRIPTION_ERROR);
    }

    // Definir rate limits após sucesso
    await redis.setRateLimit(ipRateLimitKey, RATE_LIMIT.NEWSLETTER.WINDOW_SECONDS);
    await redis.setRateLimit(emailRateLimitKey, RATE_LIMIT.NEWSLETTER.WINDOW_SECONDS);

    logger.info('Nova inscrição na newsletter', {
      domain: email.split('@')[1],
      ip,
    });

    return createSuccessResponse();
  } catch (error) {
    logger.error('Erro ao processar inscrição na newsletter', error, {
      context: 'subscribeNewsletter',
      ip,
    });
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR);
  }
}

