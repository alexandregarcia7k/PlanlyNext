"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validators/contact";
import { validateEmailSecurity, detectSuspiciousPatterns } from "@/lib/validators/email-security";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting simples (em produção, use Redis ou banco)
const rateLimitMap = new Map<string, number>();

export async function sendContactEmail(formData: FormData) {
  try {
    // Rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastAttempt = rateLimitMap.get(ip);
    
    if (lastAttempt && now - lastAttempt < 60000) { // 1 minuto
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
    if (suspiciousCheck.suspicious) {
      // Log para análise, mas não bloqueia (pode ser falso positivo)
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        event: 'suspicious_pattern_detected',
        ip: ip,
        email: email,
        reason: suspiciousCheck.reason,
        data: { name, subject, message: message.substring(0, 100) }
      }));
    }

    // Enviar email
    await resend.emails.send({
      from: "contato@planly.space",
      to: "suggestions@planly.space",
      subject: `[Planly] ${subject}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>IP: ${ip}</small></p>
      `,
    });

    // Atualizar rate limit
    rateLimitMap.set(ip, now);

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error: "Erro interno do servidor" };
  }
}