"use server";

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase(),
});

export async function subscribeNewsletter(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validationResult = newsletterSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Email inválido"
      };
    }

    const { email } = validationResult.data;

    // Verificar se variáveis existem
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Variáveis do Supabase não configuradas');
      return { success: false, error: "Configuração não encontrada" };
    }

    // Inicializar Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Inserir no Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      // Email já existe (unique constraint)
      if (error.code === '23505') {
        return {
          success: false,
          error: "Este email já está inscrito na newsletter"
        };
      }

      console.error('Erro Supabase:', error);
      return {
        success: false,
        error: "Erro ao inscrever na newsletter"
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao inscrever newsletter:", error);
    return {
      success: false,
      error: "Erro interno do servidor"
    };
  }
}
