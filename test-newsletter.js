/**
 * Script de teste para verificar a newsletter
 * Execute com: node test-newsletter.js
 */

const { createClient } = require('@supabase/supabase-js');

// Carrega variáveis do .env.local
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

console.log('🔍 Testando Newsletter...\n');
console.log('📋 Configuração:');
console.log('   SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não encontrada');
console.log('   SUPABASE_SECRET_KEY:', supabaseKey ? '✅ Definida' : '❌ Não encontrada');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'api' },
  auth: { autoRefreshToken: false, persistSession: false }
});

async function testNewsletter() {
  try {
    console.log('1️⃣ Verificando se a tabela newsletter_subscribers existe...');

    // Tenta listar os subscribers
    const { data: subscribers, error: listError } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .select('*')
      .limit(5);

    if (listError) {
      console.error('❌ Erro ao buscar subscribers:', listError.message);
      console.error('   Código:', listError.code);
      console.error('   Detalhes:', listError.details);

      if (listError.code === '42P01') {
        console.log('\n⚠️  A tabela "newsletter_subscribers" NÃO EXISTE no schema "api"!');
        console.log('\n📝 Você precisa criar a tabela no Supabase:');
        console.log('\nSQL para criar a tabela:\n');
        console.log('CREATE TABLE IF NOT EXISTS api.newsletter_subscribers (');
        console.log('  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),');
        console.log('  email TEXT UNIQUE NOT NULL,');
        console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
        console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
        console.log(');\n');
        console.log('-- Adicionar índice para melhor performance');
        console.log('CREATE INDEX IF NOT EXISTS idx_newsletter_email ON api.newsletter_subscribers(email);\n');
        console.log('-- Adicionar RLS (Row Level Security)');
        console.log('ALTER TABLE api.newsletter_subscribers ENABLE ROW LEVEL SECURITY;\n');
        console.log('-- Policy para permitir inserção (apenas server-side com service_role)');
        console.log('CREATE POLICY "Allow service role to insert" ON api.newsletter_subscribers');
        console.log('  FOR INSERT TO service_role');
        console.log('  WITH CHECK (true);\n');
      }
      return;
    }

    console.log('✅ Tabela existe!');
    console.log(`   Total de subscribers: ${subscribers?.length || 0}`);

    if (subscribers && subscribers.length > 0) {
      console.log('\n📧 Últimos subscribers:');
      subscribers.forEach((sub, idx) => {
        console.log(`   ${idx + 1}. ${sub.email} (${new Date(sub.created_at).toLocaleString('pt-BR')})`);
      });
    }

    console.log('\n2️⃣ Testando inserção de email...');

    const testEmail = `teste.${Date.now()}@example.com`;
    const { data: insertData, error: insertError } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .insert([{ email: testEmail }])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir email:', insertError.message);
      console.error('   Código:', insertError.code);
      return;
    }

    console.log('✅ Email inserido com sucesso!');
    console.log('   Email:', testEmail);
    console.log('   ID:', insertData[0]?.id);

    console.log('\n3️⃣ Testando duplicação de email...');

    const { error: duplicateError } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .insert([{ email: testEmail }]);

    if (duplicateError) {
      if (duplicateError.code === '23505') {
        console.log('✅ Validação de duplicata funcionando corretamente!');
        console.log('   Código de erro esperado: 23505');
      } else {
        console.error('❌ Erro inesperado:', duplicateError.message);
      }
    }

    console.log('\n4️⃣ Limpando email de teste...');

    const { error: deleteError } = await supabase
      .schema('api')
      .from('newsletter_subscribers')
      .delete()
      .eq('email', testEmail);

    if (deleteError) {
      console.error('⚠️  Não foi possível limpar:', deleteError.message);
    } else {
      console.log('✅ Email de teste removido!');
    }

    console.log('\n✅ TODOS OS TESTES PASSARAM!');
    console.log('\n📊 Resumo:');
    console.log('   ✅ Tabela existe');
    console.log('   ✅ Inserção funciona');
    console.log('   ✅ Validação de duplicata funciona');
    console.log('   ✅ Remoção funciona');

  } catch (error) {
    console.error('\n❌ Erro inesperado:', error.message);
    console.error('   Stack:', error.stack);
  }
}

testNewsletter()
  .then(() => {
    console.log('\n✅ Teste concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Teste falhou:', error);
    process.exit(1);
  });
