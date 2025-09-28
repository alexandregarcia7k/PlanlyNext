"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validators/contact";
import { validateEmailSecurity, detectSuspiciousPatterns } from "@/lib/validators/email-security";
import { escapeHtml, nlToBr } from "@/lib/utils/html-escape";
import { headers } from "next/headers";

// Constantes de configuração
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minuto em millisegundos

// Rate limiting simples (em produção, use Redis ou banco)
const rateLimitMap = new Map<string, number>();

export async function sendContactEmail(formData: FormData) {
  try {
    // Rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastAttempt = rateLimitMap.get(ip);
    
    if (lastAttempt && now - lastAttempt < RATE_LIMIT_WINDOW_MS) {
      return { 
        success: false, 
        error: "Aguarde 1 minuto antes de enviar outra mensagem" 
      };
    }
    
    // Honeypot anti-spam
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      return { success: false, error: "Spam detectado" };
    }

    // Extrair e validar dados
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    // Validação com Zod
    const validationResult = contactSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return { 
        success: false, 
        error: firstError.message 
      };
    }

    const { name, email, subject, message } = validationResult.data;

    // Validação de segurança do email
    const emailSecurity = validateEmailSecurity(email);
    if (!emailSecurity.valid) {
      return { success: false, error: emailSecurity.error };
    }

    // Detecção de padrões suspeitos
    const suspiciousCheck = detectSuspiciousPatterns(email, name, message);
    // Padrões suspeitos detectados mas não bloqueiam (podem ser falsos positivos)

    // Verificar se API key existe
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "Configuração de email não encontrada" };
    }

    // Inicializar Resend com API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Sanitizar todos os dados antes de usar
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = nlToBr(message);
    const safeIp = escapeHtml(ip);

    // Construir HTML seguro sem join()
    const emailHtml = 
      '<h2>Nova mensagem de contato</h2>\n' +
      '<p><strong>Nome:</strong> ' + safeName + '</p>\n' +
      '<p><strong>Email:</strong> ' + safeEmail + '</p>\n' +
      '<p><strong>Assunto:</strong> ' + safeSubject + '</p>\n' +
      '<p><strong>Mensagem:</strong></p>\n' +
      '<p>' + safeMessage + '</p>\n' +
      '<hr>\n' +
      '<p><small>IP: ' + safeIp + '</small></p>';

    // Enviar email com conteúdo sanitizado
    await resend.emails.send({
      from: "contato@planly.space",
      to: "suggestions@planly.space",
      subject: "[Planly] " + safeSubject,
      html: emailHtml,
    });

    // Atualizar rate limit
    rateLimitMap.set(ip, now);

    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro interno do servidor" };
  }
}