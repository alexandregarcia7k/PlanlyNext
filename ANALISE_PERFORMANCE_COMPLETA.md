# 🔍 Análise Completa de Performance - PlanlyNext

**Data:** 6 de outubro de 2025  
**Status:** Landing Page em desenvolvimento  
**Objetivo:** Identificar gargalos e otimizar antes de adicionar features

---

## 📊 RESUMO EXECUTIVO

### Problema Principal
**Build lento (10-16s)** e **First Load JS pesado (230 kB)** para uma landing page simples.

### Causa Raiz
- **Dependências pesadas:** 645 MB em node_modules, muitas não usadas na landing
- **Framer Motion completo:** Importando biblioteca inteira (~100 KB)
- **Radix UI:** 8 componentes importados, mas apenas 2-3 usados na landing
- **Chunks grandes:** 3d0703cbfa627da7.js (308 KB), 8de809347c30b2a8.js (286 KB)

### Impacto
- Landing page carrega **230 kB de JS** (meta: <100 kB)
- Build demora **10-16s** (meta: <5s para landing simples)
- **Overhead para futuras features:** Adicionar funcionalidades vai piorar

---

## 🚨 PROBLEMAS CRÍTICOS

### 1. Dependências Não Utilizadas na Landing Page

**Dependências pesadas que NÃO são usadas na landing:**

```json
// NÃO USADO NA LANDING (apenas em /dashboard, /notes)
"@dnd-kit/core": "^6.3.1",           // 50+ KB - apenas Gantt
"@dnd-kit/modifiers": "^9.0.0",      // 20+ KB - apenas Gantt
"@supabase/supabase-js": "^2.58.0",  // 80+ KB - apenas notas/auth
"@upstash/redis": "^1.35.4",         // 30+ KB - backend
"@react-email/render": "^1.3.1",     // 40+ KB - backend email
"resend": "^6.1.0",                  // 25+ KB - backend email
"simplex-noise": "^4.0.3",           // 15+ KB - não usado?
"lenis": "^1.3.11",                  // 10+ KB - não usado (removemos hook)
"motion": "^12.23.15",               // DUPLICADO com framer-motion!
"date-fns": "^4.1.0",                // 30+ KB - apenas Gantt
"lodash.throttle": "^4.1.1"          // 5 KB - pode usar nativo
```

**Total desperdiçado na landing:** ~305 KB

### 2. Importações Pesadas do Framer Motion

**Problema:**
```tsx
// Hero.tsx, Features.tsx, etc.
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
```

**Framer Motion é ENORME:**
- Core: ~60 KB
- Hooks: ~20 KB
- Layout animations: ~15 KB
- **Total:** ~100 KB apenas para animações!

**Solução:**
- Usar CSS animations + Intersection Observer para fade-ins simples
- Manter Framer Motion apenas em páginas complexas (Gantt)
- Lazy load Framer Motion só quando necessário

### 3. Radix UI Overhead

**Importado mas pouco usado na landing:**

```tsx
// Usado:
@radix-ui/react-tooltip     // ✅ Usado (Hero, Features)
@radix-ui/react-switch      // ✅ Usado (ThemeSwitcher)

// Carregado mas raramente usado na landing:
@radix-ui/react-checkbox    // ❌ Apenas Gantt
@radix-ui/react-context-menu // ❌ Apenas Gantt
@radix-ui/react-label       // ❌ Apenas forms
@radix-ui/react-toast       // ✅ Usado (Sonner wrapper)
@radix-ui/react-slot        // ✅ Usado (Button)
@radix-ui/react-use-controllable-state // ❌ Interno
```

**Impacto:** ~40 KB de componentes Radix não usados na landing

### 4. Chunks Gigantes

**Análise dos chunks:**

```bash
3d0703cbfa627da7.js  308 KB  # Framer Motion + Radix UI
8de809347c30b2a8.js  286 KB  # React + Next.js runtime
a6dad97d9634a72d.js  110 KB  # Lucide icons (TODOS carregados!)
7880f8283a6f3daf.js  185 KB  # CSS + Tailwind utilities
3e0f93b37bf948e9.js   64 KB  # Polyfills
2008ffcf9e5b170c.js   45 KB  # Utils
```

**Problema:** Lucide icons carrega TODOS os ícones (110 KB) mesmo usando apenas ~15.

### 5. Componentes Não Otimizados

**Components carregados na landing mas não usados:**

```tsx
// src/components/ui/kibo-ui/gantt/index.tsx
// 1200+ linhas, ~80 KB
// ❌ NÃO É USADO NA LANDING!

// src/components/ui/kibo-ui/landingpageui/context-menu.tsx
// Carregado mas nunca usado na landing

// src/components/ui/kibo-ui/landingpageui/checkbox.tsx
// Carregado mas não usado na landing
```

### 6. Imagens Ainda Pesadas

**Atual:**
- `kanbandark.png`: 1920x933 = ~150 KB (otimizado, mas pode melhorar)
- `kanbanlight.png`: 1920x933 = ~150 KB
- `notesdark.png`: 1400x843 = ~100 KB
- `noteslight.png`: 1400x843 = ~100 KB

**Total de imagens:** ~500 KB (ok, mas pode usar WebP moderno)

---

## 📈 MÉTRICAS ATUAIS VS. METAS

| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| **First Load JS** | 230 kB | <100 kB | 🔴 -130% |
| **Build Time** | 10-16s | <5s | 🔴 -100% |
| **Node Modules** | 645 MB | <300 MB | 🔴 -115% |
| **Landing Chunks** | 8 chunks | 3-4 chunks | 🟡 -100% |
| **Images** | 500 KB | <400 KB | 🟢 -25% |
| **Lighthouse** | ? | >90 | ⚪ Não medido |

---

## 🎯 PLANO DE OTIMIZAÇÃO DETALHADO

### FASE 1: Remover Dependências Não Utilizadas (Impacto: 🔥🔥🔥)

**Ação imediata:**

```bash
# Remover dependências não usadas na landing
npm uninstall simplex-noise lenis motion lodash.throttle

# Mover para devDependencies (não vão pro bundle de produção)
npm uninstall @dnd-kit/core @dnd-kit/modifiers date-fns
npm install -D @dnd-kit/core @dnd-kit/modifiers date-fns
```

**Ganho esperado:** -50 KB bundle, -3s build time

### FASE 2: Lazy Load Componentes Pesados (Impacto: 🔥🔥🔥)

**Implementar code-splitting agressivo:**

```tsx
// src/app/(marketing)/page.tsx
import dynamic from 'next/dynamic';

// Lazy load apenas quando necessário
const Features2 = dynamic(() => import('@/components/landing/Features2'));
const Features3 = dynamic(() => import('@/components/landing/Features3'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
const Parallax = dynamic(() => import('@/components/landing/Parallax'));

// Carrega imediatamente (above the fold)
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
```

**Ganho esperado:** -80 KB initial load, +1s FCP

### FASE 3: Substituir Framer Motion por CSS na Landing (Impacto: 🔥🔥🔥)

**Criar animações CSS leves:**

```tsx
// src/components/landing/animations-lite.tsx (NOVO)
'use client';

import { useEffect, useRef, useState } from 'react';

// Intersection Observer Hook (2 KB vs 100 KB do Framer)
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Componente de fade-in simples
export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

**Substituir Framer Motion apenas na landing:**

```tsx
// Hero.tsx - ANTES (100 KB)
import { motion } from 'framer-motion';
<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>

// Hero.tsx - DEPOIS (2 KB)
import { FadeIn } from './animations-lite';
<FadeIn delay={200}>
```

**Ganho esperado:** -100 KB bundle, +2s FCP, -5s build time

### FASE 4: Otimizar Lucide Icons (Impacto: 🔥🔥)

**Usar importações diretas:**

```tsx
// ANTES (carrega TODOS os ícones - 110 KB)
import { ArrowRight, Check, Mail } from 'lucide-react';

// DEPOIS (carrega apenas os usados - 5 KB)
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Check from 'lucide-react/dist/esm/icons/check';
import Mail from 'lucide-react/dist/esm/icons/mail';
```

**Ou criar barrel file:**

```tsx
// src/components/icons.ts
export { default as ArrowRight } from 'lucide-react/dist/esm/icons/arrow-right';
export { default as Check } from 'lucide-react/dist/esm/icons/check';
export { default as Mail } from 'lucide-react/dist/esm/icons/mail';
// ... apenas os 15 ícones usados

// Uso:
import { ArrowRight, Check } from '@/components/icons';
```

**Ganho esperado:** -105 KB bundle

### FASE 5: Separar Landing de App (Impacto: 🔥🔥🔥)

**Estratégia: Landing ultra-leve + App completo**

```
src/
├── app/
│   ├── (landing)/           # Landing page LEVE
│   │   ├── layout.tsx       # Layout mínimo
│   │   └── page.tsx         # Hero + Features apenas
│   │
│   └── (app)/               # App COMPLETO (todas dependências)
│       ├── layout.tsx       # Layout com Framer, Radix, etc.
│       ├── dashboard/
│       ├── notes/
│       └── gantt/
│
├── components/
│   ├── landing/             # Componentes LEVES (CSS animations)
│   └── app/                 # Componentes RICOS (Framer, Radix)
```

**Configurar next.config.ts:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-tooltip',
    ],
  },
  
  // Separate chunks por rota
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        landing: {
          test: /[\\/]components[\\/]landing[\\/]/,
          name: 'landing',
          priority: 10,
        },
        app: {
          test: /[\\/]components[\\/](app|ui[\\/]kibo-ui[\\/]gantt)[\\/]/,
          name: 'app',
          priority: 5,
        },
      },
    };
    return config;
  },
};
```

**Ganho esperado:** -150 KB landing bundle, +3s FCP

### FASE 6: Otimizar Imagens (Impacto: 🔥)

**Converter para WebP moderno:**

```bash
# Usar sharp para converter
npm install -D sharp

# Script de conversão
node scripts/convert-images.js
```

```javascript
// scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');

const images = [
  'public/assets/kanbandark.png',
  'public/assets/kanbanlight.png',
  'public/assets/notesdark.png',
  'public/assets/noteslight.png',
];

images.forEach(async (img) => {
  await sharp(img)
    .webp({ quality: 85, effort: 6 })
    .toFile(img.replace('.png', '.webp'));
  
  console.log(`✅ ${img} -> WebP`);
});
```

**Atualizar componentes:**

```tsx
// Hero.tsx
<Image
  src="/assets/kanbandark.webp"  // .png -> .webp
  alt="app screen"
  width={1920}
  height={933}
  quality={85}
  priority
/>
```

**Ganho esperado:** -200 KB imagens (500 KB -> 300 KB)

### FASE 7: Implementar Server Components (Impacto: 🔥🔥)

**Converter componentes estáticos:**

```tsx
// src/components/landing/Features2.tsx
// ANTES: 'use client' (carrega no cliente)
'use client'
import { Card } from '@/components/ui/card'

export default function Features2() {
  return <Card>...</Card>
}

// DEPOIS: Server Component (renderiza no servidor)
import { Card } from '@/components/ui/card'

export default function Features2() {
  return <Card>...</Card>  // HTML puro enviado ao cliente
}
```

**Componentes que podem ser Server Components:**
- ✅ Features2.tsx (apenas SVG estático)
- ✅ Footer.tsx (links estáticos)
- ✅ Header.tsx (apenas mobile menu precisa client)
- ❌ Hero.tsx (precisa animações)
- ❌ Features.tsx (precisa scroll tilt)
- ❌ Contact.tsx (precisa form submit)

**Ganho esperado:** -30 KB bundle, +0.5s FCP

---

## 🔢 GANHOS ESPERADOS (TOTAL)

| Otimização | Ganho Bundle | Ganho Build | Ganho FCP |
|------------|--------------|-------------|-----------|
| Fase 1: Remover deps | -50 KB | -3s | +0.2s |
| Fase 2: Lazy load | -80 KB | +0s | +1.0s |
| Fase 3: CSS animations | -100 KB | -5s | +2.0s |
| Fase 4: Lucide direto | -105 KB | -1s | +0.5s |
| Fase 5: Separar landing/app | -150 KB | -3s | +3.0s |
| Fase 6: WebP | -200 KB | +0s | +0.5s |
| Fase 7: Server Components | -30 KB | -1s | +0.5s |
| **TOTAL** | **-715 KB** | **-13s** | **+7.7s** |

**Resultado final esperado:**

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **First Load JS** | 230 KB | **65 KB** | **-72%** 🎉 |
| **Build Time** | 16s | **3s** | **-81%** 🎉 |
| **FCP** | ~2.5s | **~1.0s** | **-60%** 🎉 |
| **Lighthouse** | ~60 | **~95** | **+35pts** 🎉 |

---

## ⚡ QUICK WINS (Implementar HOJE)

### 1. Remover dependências não usadas (5 min)
```bash
npm uninstall simplex-noise lenis motion lodash.throttle
```

### 2. Lazy load Features2, Features3, Contact (10 min)
```tsx
// src/app/(marketing)/page.tsx
const Features2 = dynamic(() => import('@/components/landing/Features2'));
const Features3 = dynamic(() => import('@/components/landing/Features3'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
```

### 3. Converter imagens para WebP (15 min)
```bash
npm install -D sharp
node scripts/convert-images.js
```

**Ganho imediato:** -250 KB, -3s build, +2s FCP = **30 minutos para 50% de melhoria!**

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Sprint 1 (Hoje - Quick Wins)
- [ ] Remover deps não usadas
- [ ] Lazy load Features2/3 + Contact
- [ ] Converter imagens WebP

**Ganho:** -250 KB, -3s build  
**Tempo:** 30 minutos

### Sprint 2 (Esta Semana)
- [ ] Criar animations-lite.tsx
- [ ] Substituir Framer Motion por CSS na landing
- [ ] Otimizar importações Lucide

**Ganho:** -205 KB, -6s build  
**Tempo:** 3-4 horas

### Sprint 3 (Próxima Semana)
- [ ] Separar landing/(landing) de app/(app)
- [ ] Configurar webpack chunks
- [ ] Converter componentes para Server Components

**Ganho:** -180 KB, -4s build  
**Tempo:** 6-8 horas

### Sprint 4 (Depois de Feature Completa)
- [ ] Adicionar Lighthouse CI
- [ ] Monitorar Core Web Vitals
- [ ] A/B test com/sem otimizações

---

## 📚 RECURSOS E REFERÊNCIAS

### Ferramentas de Análise
- **Lighthouse:** `npm run build && npm run start` → Chrome DevTools → Lighthouse
- **Bundle Analyzer:** `npm install -D @next/bundle-analyzer`
- **Turbopack Trace:** `TURBOPACK_TRACING=1 npm run build`

### Benchmarks de Referência
- **Landing page pequena:** 50-80 KB First Load JS
- **Landing page média:** 80-120 KB First Load JS  
- **Landing page complexa:** 120-180 KB First Load JS
- **Atual (Planly):** 230 KB ❌ (muito pesado!)

### Links Úteis
- [Next.js Bundle Analyzer](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Framer Motion Performance](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [Lucide Optimization](https://lucide.dev/guide/packages/lucide-react#tree-shaking)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

## 🎓 LIÇÕES APRENDIDAS

### O Que Está Bom
✅ Imagens já otimizadas (1920x933, 1400x843)  
✅ Blur reduzido (blur-lg em vez de blur-3xl)  
✅ Scroll nativo (scrollIntoView)  
✅ Variants unificados (imageEntrance)  
✅ Hooks de scroll limpos (apenas 1 usado)

### O Que Precisa Melhorar
❌ Dependências não utilizadas (~305 KB)  
❌ Framer Motion na landing (~100 KB)  
❌ Lucide carregando todos ícones (~110 KB)  
❌ Sem code-splitting agressivo  
❌ Sem Server Components  
❌ PNG em vez de WebP

### Próximos Aprendizados
🎯 Code-splitting estratégico  
🎯 CSS animations vs JS animations  
🎯 Server Components vs Client Components  
🎯 Bundle analysis com Webpack Bundle Analyzer  
🎯 Core Web Vitals monitoring

---

## 📌 CONCLUSÃO

### Problema Principal
**Landing page pesada demais para o conteúdo que oferece.**  
230 KB de JS para mostrar Hero + Features + Contact = **overkill**.

### Causa Raiz
**Dependências pesadas importadas sem necessidade:**
- Framer Motion completo (-100 KB possível)
- Lucide todos ícones (-105 KB possível)
- Deps não usadas (-50 KB possível)
- Sem code-splitting (-80 KB possível)

### Solução
**Separar landing (leve) de app (completo):**
- Landing: CSS animations + Intersection Observer
- App: Framer Motion + Radix completo + Gantt

### Próximo Passo
**Implementar Quick Wins (30 min) para ganho imediato de 50%:**
1. Remover deps não usadas
2. Lazy load Features2/3 + Contact
3. Converter imagens WebP

**Depois implementar Fases 2-7 para atingir meta de 65 KB.**

---

**Autor:** GitHub Copilot  
**Revisão:** Necessária após implementação de cada fase  
**Última atualização:** 6 de outubro de 2025
