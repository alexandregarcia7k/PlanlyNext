"use server";

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Inicializar Supabase com fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lxinavyvatxalmsfiyye.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aW5hdnl2YXR4YWxtc2ZpeXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NzU3ODcsImV4cCI6MjA3MzA1MTc4N30.XLaPiraoNsaUuGnBf0ouzSHTtPS2nBQ_tvq-Y6P2-zw';

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'api'
  }
});

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

    // Inserir usando cliente Supabase no schema api
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
    return {
      success: false,
      error: "Erro interno do servidor"
    };
  }
}
