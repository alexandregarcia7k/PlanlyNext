"use server";

import { Resend } from "resend";
import { createClient } from '@supabase/supabase-js';
import { Redis } from "@upstash/redis";
import { z } from 'zod';
import { contactSchema } from "@/lib/validators/contact";
import { validateEmailSecurity } from "@/lib/validators/email-security";
import { escapeHtml, nlToBr } from "@/lib/utils/html-escape";
import { headers } from "next/headers";

// Types
type ActionResponse = {
  success: boolean;
  error?: string;
};

// Cliente Redis para rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Utilitários
function createErrorResponse(error: string): ActionResponse {
  return { success: false, error };
}

function createSuccessResponse(): ActionResponse {
  return { success: true };
}

function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'api' },
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

const newsletterSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
});

export async function sendContactEmail(formData: FormData): Promise<ActionResponse> {
  try {
    // Rate limiting com Redis
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `rate_limit:contact:${ip}`;
    
    const lastAttempt = await redis.get(rateLimitKey);
    if (lastAttempt) {
      return createErrorResponse("Aguarde 1 minuto antes de enviar outra mensagem");
    }
    
    // Honeypot anti-spam
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      return createErrorResponse("Spam detectado");
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

    if (!process.env.RESEND_API_KEY) {
      return createErrorResponse("Configuração de email não encontrada");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

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

    await redis.set(rateLimitKey, Date.now(), { ex: 60 });
    return createSuccessResponse();
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return createErrorResponse("Erro interno do servidor");
  }
}

export async function subscribeNewsletter(formData: FormData): Promise<ActionResponse> {
  try {
    const rawData = { email: formData.get("email") as string };
    const validationResult = newsletterSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return createErrorResponse("Email inválido");
    }

    const { email } = validationResult.data;
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        return createErrorResponse("Este email já está inscrito na newsletter");
      }
      return createErrorResponse("Erro ao inscrever na newsletter");
    }

    return createSuccessResponse();
  } catch (error) {
    console.error('Erro ao inscrever newsletter:', error);
    return createErrorResponse("Erro interno do servidor");
  }
}

