import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim(),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .toLowerCase(),
  subject: z
    .string()
    .min(5, "Assunto deve ter pelo menos 5 caracteres")
    .max(20, "Assunto deve ter no máximo 20 caracteres")
    .trim(),
  message: z
    .string()
    .min(30, "Mensagem deve ter pelo menos 30 caracteres")
    .max(650, "Mensagem deve ter no máximo 650 caracteres")
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;