import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

//lazy client - só quando necessário
let supabaseClient: SupabaseClient | null = null;

// func para supabase client com lazy init, usando as variaveis de .env.ts
function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return supabaseClient;
}

// client supabase singleton com Proxy para lazy loading
// Só cria o cliente quando acessado pela primeira vez
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

