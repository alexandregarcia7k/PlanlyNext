import { createClient } from '@supabase/supabase-js';

// Função para validar e obter cliente Supabase
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL não está configurada');
  }
  
  if (!supabaseKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Exportar cliente com validação lazy
export const supabase = createSupabaseClient();