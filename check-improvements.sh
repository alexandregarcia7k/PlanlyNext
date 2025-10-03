#!/bin/bash

# 🚀 Script de Validação do Projeto PlanlyNext
# Este script verifica se todas as melhorias foram implementadas corretamente

echo "🔍 Verificando implementação das melhorias..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de checks
PASSED=0
FAILED=0

# Função para check
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} Arquivo existe: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Arquivo faltando: $1"
        ((FAILED++))
    fi
}

# Função para check de conteúdo
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $3"
        ((FAILED++))
    fi
}

echo "📁 Verificando arquivos novos..."
check_file "src/lib/env.ts"
check_file "src/lib/logger.ts"
check_file "src/lib/redis.ts"
check_file "src/lib/constants.ts"
check_file "src/types/index.ts"
check_file "src/middleware.ts"
check_file "ANALYSIS_AND_RECOMMENDATIONS.md"
check_file "EXECUTIVE_SUMMARY.md"
check_file "QUICK_START_GUIDE.md"

echo ""
echo "🔧 Verificando atualizações em arquivos existentes..."
check_content "src/server/actions.ts" "import.*env.*from.*@/lib/env" "Import de env em actions.ts"
check_content "src/server/actions.ts" "import.*logger.*from.*@/lib/logger" "Import de logger em actions.ts"
check_content "src/server/actions.ts" "logger\.error" "Uso de logger em actions.ts"
check_content "src/server/actions.ts" "ERROR_MESSAGES" "Uso de constantes em actions.ts"
check_content "src/lib/supabase.ts" "import.*env.*from.*\./env" "Import de env em supabase.ts"
check_content ".env.example" "UPSTASH_REDIS_REST_URL" "Variáveis de Redis em .env.example"
check_content ".env.example" "RESEND_API_KEY" "Variáveis de Resend em .env.example"

echo ""
echo "🚫 Verificando remoção de código problemático..."

if ! grep -q "console\.error" "src/server/actions.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Nenhum console.error em actions.ts"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️${NC}  Ainda há console.error em actions.ts"
    ((FAILED++))
fi

if ! grep -q "process\.env\.UPSTASH_REDIS_REST_URL" "src/server/actions.ts" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Redis não é criado localmente em actions.ts"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Redis ainda é criado localmente em actions.ts"
    ((FAILED++))
fi

echo ""
echo "📦 Verificando dependências..."

if [ -f "package.json" ]; then
    if grep -q "\"zod\"" package.json; then
        echo -e "${GREEN}✅${NC} Zod instalado"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Zod não encontrado"
        ((FAILED++))
    fi

    if grep -q "\"@upstash/redis\"" package.json; then
        echo -e "${GREEN}✅${NC} Upstash Redis instalado"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Upstash Redis não encontrado"
        ((FAILED++))
    fi
fi

echo ""
echo "🔒 Verificando configurações de segurança..."
check_content "next.config.ts" "Content-Security-Policy" "CSP configurado"
check_content "src/middleware.ts" "X-Frame-Options" "Headers de segurança no middleware"

echo ""
echo "═══════════════════════════════════════════════"
echo -e "📊 Resultado: ${GREEN}${PASSED} passaram${NC} | ${RED}${FAILED} falharam${NC}"
echo "═══════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Parabéns! Todas as verificações passaram!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Execute: npm run typecheck"
    echo "2. Execute: npm run lint"
    echo "3. Execute: npm run dev"
    echo "4. Teste o formulário de contato"
    echo ""
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Algumas verificações falharam${NC}"
    echo ""
    echo "Consulte o QUICK_START_GUIDE.md para instruções detalhadas"
    echo ""
    exit 1
fi
