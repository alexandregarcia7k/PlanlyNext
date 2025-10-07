# 🎓 Guia Educacional - Otimizações de Performance

**Objetivo:** Aprender conceitos de performance web enquanto otimiza o projeto

---

## 📚 1. LUCIDE ICONS - Tree Shaking

### O Problema
Quando você importa:
```tsx
import { ArrowRight, Check } from 'lucide-react';
```

O **tree-shaking** (remoção de código não usado) pode falhar e carregar **TODOS os ícones** (~110 KB).

### Por Que Acontece?
- **Tree-shaking** depende do bundler (Webpack/Turbopack) analisar o código
- Se a biblioteca não está bem configurada para tree-shaking, carrega tudo
- Lucide-react tem ~2000 ícones, mas você usa apenas ~40

### ✅ Solução - optimizePackageImports do Next.js

O Next.js 15 tem uma feature **experimental** que força tree-shaking:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],  // ← Força tree-shaking
  },
};
```

**Como Funciona:**
1. Next.js analisa todas as importações de `lucide-react`
2. Identifica quais ícones você realmente usa
3. Cria um chunk separado apenas com esses ícones
4. Resultado: 110 KB → ~10 KB

**Ganho:** -100 KB (-91%)

---

## 🚀 2. CODE-SPLITTING (Lazy Loading)

### O Que É?
**Code-splitting** divide seu JavaScript em **chunks** (pedaços) que carregam **sob demanda**.

### Como Funciona?

**ANTES (sem code-splitting):**
```
Usuário acessa / 
  ↓
Baixa TUDO de uma vez:
  - Hero (necessário) ✅
  - Features (necessário) ✅
  - Features2 (usuário nem viu ainda) ❌
  - Features3 (usuário nem viu ainda) ❌
  - Contact (usuário nem viu ainda) ❌
  - Footer (usuário nem viu ainda) ❌

Total: 230 KB baixados imediatamente
FCP: 2.5s (lento)
```

**DEPOIS (com code-splitting):**
```
Usuário acessa /
  ↓
Baixa apenas o necessário:
  - Hero ✅
  - Features ✅

Total inicial: 150 KB
FCP: 1.0s (rápido) 🎉

Usuário scrolla...
  ↓
Baixa Features2 (30 KB)

Usuário scrolla mais...
  ↓
Baixa Features3 (40 KB)

Usuário scrolla até Contact...
  ↓
Baixa Contact (10 KB)
```

### Implementação

```tsx
// src/app/(marketing)/page.tsx
import dynamic from 'next/dynamic';

// ✅ Carrega imediatamente (above the fold)
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

// 🚀 Lazy load (carrega quando necessário)
const Features2 = dynamic(() => import('@/components/landing/Features2'), {
  loading: () => <div>Carregando...</div>,  // Opcional: mostrar loading
});

const Features3 = dynamic(() => import('@/components/landing/Features3'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

export default function LandingPage() {
  return (
    <>
      <Hero />       {/* Carrega imediatamente */}
      <Features />   {/* Carrega imediatamente */}
      <Features2 />  {/* Carrega quando visível */}
      <Features3 />  {/* Carrega quando visível */}
      <Contact />    {/* Carrega quando visível */}
      <Footer />     {/* Carrega quando visível */}
    </>
  );
}
```

**Ganho:** -80 KB initial load, +1s FCP

---

## 🖼️ 3. CONVERSÃO DE IMAGENS PARA WEBP

### O Problema
**PNG** é lossless (sem perda), mas pesado:
- kanbandark.png: ~150 KB
- kanbanlight.png: ~150 KB
- Total: 300 KB

### A Solução
**WebP** é um formato moderno com compressão melhor:
- Mesma qualidade visual
- 25-35% menor que PNG
- Suportado por 97% dos browsers

### Como Funciona?

**Sharp** é uma biblioteca Node.js para processar imagens:

```javascript
// scripts/convert-images.js
const sharp = require('sharp');

const images = [
  'public/assets/kanbandark.png',
  'public/assets/kanbanlight.png',
  'public/assets/notesdark.png',
  'public/assets/noteslight.png',
];

images.forEach(async (img) => {
  await sharp(img)
    .webp({
      quality: 85,    // Qualidade 85% (quase imperceptível)
      effort: 6,      // Effort 6 = compressão máxima
    })
    .toFile(img.replace('.png', '.webp'));
  
  console.log(`✅ ${img} convertido para WebP`);
});
```

**Depois, atualizar componentes:**
```tsx
// Hero.tsx - ANTES
<Image src="/assets/kanbandark.png" />

// Hero.tsx - DEPOIS
<Image src="/assets/kanbandark.webp" />
```

**Ganho:** -100 KB (300 KB → 200 KB) = -33%

---

## 🏗️ 4. SERVER COMPONENTS

### O Que São?
**Server Components** renderizam no **servidor** (não no browser).

### Diferença

**CLIENT COMPONENT (usa 'use client'):**
```tsx
'use client'  // ← Precisa rodar no browser
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);  // Estado = precisa cliente
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
- Roda no browser
- Precisa baixar JavaScript
- Pode ter interatividade (onClick, useState, etc.)

**SERVER COMPONENT (sem 'use client'):**
```tsx
// Sem 'use client' = Server Component
export default function Features2() {
  return (
    <div>
      <h2>100% Intuitivo</h2>
      <svg>...</svg>  {/* Apenas HTML estático */}
    </div>
  );
}
```
- Roda no servidor
- Vira HTML puro
- Não baixa JavaScript
- Não pode ter interatividade

### Quando Usar Cada Um?

**Use CLIENT:**
- ✅ Formulários (onSubmit)
- ✅ Animações (Framer Motion)
- ✅ Estado (useState, useEffect)
- ✅ Event handlers (onClick, onChange)

**Use SERVER:**
- ✅ Conteúdo estático (texto, SVGs)
- ✅ Listagens sem interação
- ✅ SEO-friendly content

### Exemplo Prático

**Features2.tsx - ANTES (Client):**
```tsx
'use client'  // ← Desnecessário! Não tem interação
import { Card } from '@/components/ui/card';

export default function Features2() {
  return (
    <Card>
      <svg>...</svg>  {/* Apenas SVG estático */}
      <h2>100% Intuitivo</h2>
    </Card>
  );
}
```
**Resultado:** Baixa JavaScript do Card, React, etc. (~20 KB)

**Features2.tsx - DEPOIS (Server):**
```tsx
// Remove 'use client'
import { Card } from '@/components/ui/card';

export default function Features2() {
  return (
    <Card>
      <svg>...</svg>
      <h2>100% Intuitivo</h2>
    </Card>
  );
}
```
**Resultado:** Apenas HTML puro (~2 KB)

**Ganho:** -18 KB por componente

---

## ⚙️ 5. CONFIGURAR NEXT.JS (next.config.ts)

### optimizePackageImports

**O Que Faz:**
Força tree-shaking em bibliotecas específicas.

```typescript
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',        // Carrega apenas ícones usados
      'framer-motion',       // Carrega apenas hooks usados
      '@radix-ui/react-tooltip',  // Otimiza Radix UI
    ],
  },
};
```

**Como Funciona:**
1. Next.js analisa imports dessas bibliotecas
2. Cria um mapa de "o que é usado"
3. Bundler remove o resto
4. Resultado: Bundle menor

**Ganho:** -100 KB (Lucide) + -20 KB (Framer) = -120 KB

### Webpack Chunks (Avançado)

**O Problema:**
Tudo fica em 1 chunk gigante (308 KB).

**Solução:**
Dividir em chunks por rota:

```typescript
webpack: (config) => {
  config.optimization.splitChunks = {
    chunks: 'all',  // Divide todos os chunks
    cacheGroups: {
      // Chunk para landing page
      landing: {
        test: /[\\/]components[\\/]landing[\\/]/,
        name: 'landing',
        priority: 10,  // Alta prioridade
      },
      // Chunk para app (dashboard, notes)
      app: {
        test: /[\\/]components[\\/](app|gantt)[\\/]/,
        name: 'app',
        priority: 5,
      },
    },
  };
  return config;
};
```

**Resultado:**
- ANTES: 1 chunk de 308 KB
- DEPOIS: 
  - landing.js: 80 KB (apenas landing)
  - app.js: 228 KB (só carrega em /dashboard)

**Ganho:** -228 KB na landing page

---

## 🎯 RESUMO - O QUE FAZER

### FASE 1: Quick Wins (30 min)

1. **Remover deps não usadas:**
```bash
npm uninstall simplex-noise motion
```

2. **Converter imagens WebP:**
```bash
npm install -D sharp
# Criar scripts/convert-images.js
node scripts/convert-images.js
```

3. **Lazy load:**
```tsx
// src/app/(marketing)/page.tsx
const Features2 = dynamic(() => import('@/components/landing/Features2'));
const Features3 = dynamic(() => import('@/components/landing/Features3'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
```

**Ganho:** -150 KB, -3s build

### FASE 2: Configurar Next.js (10 min)

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react', 'framer-motion'],
},
```

**Ganho:** -120 KB

### FASE 3: Server Components (20 min)

Remover `'use client'` de:
- Features2.tsx (apenas SVG)
- Footer.tsx (apenas links)

**Ganho:** -30 KB

---

## 📊 RESULTADO FINAL ESPERADO

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| First Load JS | 230 KB | **110 KB** | **-52%** 🎉 |
| Build Time | 16s | **8s** | **-50%** 🎉 |
| FCP | ~2.5s | **~1.5s** | **-40%** 🎉 |
| Lighthouse | ~60 | **~85** | **+25pts** 🎉 |

---

## 🎓 CONCEITOS IMPORTANTES

### Tree-Shaking
Processo de remover código não usado do bundle final.

### Code-Splitting
Dividir JavaScript em chunks que carregam sob demanda.

### Lazy Loading
Carregar recursos apenas quando necessário (usuário scrolla, clica, etc.).

### Server Components
Componentes que renderizam no servidor e viram HTML puro.

### Client Components
Componentes que precisam rodar no browser (interatividade).

### Bundle
Arquivo final JavaScript que o browser baixa.

### Chunk
Pedaço de um bundle (pode ter vários chunks).

### FCP (First Contentful Paint)
Tempo até o primeiro conteúdo aparecer na tela.

### First Load JS
Quantidade de JavaScript baixada no primeiro acesso.

---

**Próximo Passo:** Implementar Fase 1 (Quick Wins) agora!
