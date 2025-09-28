"use server";

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Função para criar cliente Supabase com validação lazy
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    db: {
      schema: 'api'
    }
  });
}

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

    // Criar cliente e inserir no schema api
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .schema('api')
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

      return {
        success: false,
        error: "Erro ao inscrever na newsletter"
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao inscrever newsletter:', error);
    return {
      success: false,
      error: "Erro interno do servidor"
    };
  }
}
