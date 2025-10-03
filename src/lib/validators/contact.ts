import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim()
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome deve conter apenas letras"),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .toLowerCase(),
  subject: z
    .string()
    .min(5, "Assunto deve ter pelo menos 5 caracteres")
    .max(100, "Assunto deve ter no máximo 100 caracteres")
    .trim(),
  message: z
    .string()
    .min(30, "Mensagem deve ter pelo menos 30 caracteres")
    .max(1000, "Mensagem deve ter no máximo 1000 caracteres")
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
