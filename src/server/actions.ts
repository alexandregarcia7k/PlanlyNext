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
import { validateEmailSecurity } from "@/lib/validators/email-security";
import { escapeHtml, nlToBr } from "@/lib/utils/html-escape";
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


    // Extrair e validar dados
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const validationResult = contactSchema.safeParse(rawData);
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error.issues[0].message);
    }

    const { name, email, subject, message } = validationResult.data;

    // Validação de segurança do email
    const emailSecurity = validateEmailSecurity(email);
    if (!emailSecurity.valid) {
      return createErrorResponse(emailSecurity.error ?? "Erro de validação de email");
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
  try {
    const rawData = { email: formData.get("email") as string };
    const validationResult = newsletterSchema.safeParse(rawData);

    if (!validationResult.success) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_EMAIL);
    }

    const { email } = validationResult.data;
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        return createErrorResponse(ERROR_MESSAGES.EMAIL_ALREADY_SUBSCRIBED);
      }
      return createErrorResponse(ERROR_MESSAGES.NEWSLETTER_SUBSCRIPTION_ERROR);
    }

    return createSuccessResponse();
  } catch (error) {
    logger.error('Erro ao processar inscrição na newsletter', error, {
      context: 'subscribeNewsletter',
    });
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR);
  }
}

