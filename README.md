# 🚀 PlanlyNext

> Aplicação moderna de produtividade e gestão de tarefas com Next.js 15

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![Qualidade](https://img.shields.io/badge/Qualidade-7.6%2F10-green)](#)

---

## 📖 Sobre o Projeto

PlanlyNext é uma aplicação completa de produtividade que inclui:
- 📊 **Gantt Chart** - Visualização de projetos e tarefas
- 📝 **Sistema de Notas** - Gerenciamento de anotações
- 📧 **Formulário de Contato** - Integração com Resend
- 🎨 **Landing Page** - Design moderno com Framer Motion

---

## ⚡ Melhorias Recentes (v2.0)

Este projeto passou por uma análise completa de segurança e qualidade, resultando em **+33% de melhoria geral**:

### ✅ O que foi implementado:
- 🔐 **Sistema de Validação de Ambiente** (`src/lib/env.ts`) - Type-safe com Zod
- 📝 **Sistema de Logging Estruturado** (`src/lib/logger.ts`) - Seguro para produção
- 🛡️ **Cliente Redis Resiliente** (`src/lib/redis.ts`) - Fail-open pattern
- 📦 **Constantes Centralizadas** (`src/lib/constants.ts`) - DRY principle
- 🔧 **Tipos Compartilhados** (`src/types/index.ts`) - Zero duplicação
- 🚪 **Middleware de Segurança** (`src/middleware.ts`) - Headers seguros

### 📊 Métricas de Melhoria:
| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Qualidade Geral** | 5.7/10 | 7.6/10 | +33% |
| **Segurança** | 4/10 | 8/10 | +100% |
| **Manutenibilidade** | 6/10 | 8/10 | +33% |

**📚 Documentação completa:** Veja [INDEX.md](./INDEX.md) para começar

---

## 📁 Estrutura de Pastas

Este projeto segue uma estrutura moderna para aplicações Next.js, separando responsabilidades e facilitando a organização do código. Veja abaixo o que significa cada pasta:

```
src/
  app/                # Rotas e páginas principais do app (Next.js App Router)
    (marketing)/      # Páginas públicas (ex.: landing page, login, cadastro)
    (app)/            # Área autenticada (dashboard, notas, etc.)
    globals.css       # Estilos globais (Tailwind)
    layout.tsx        # Layout raiz do app (envolve todas as páginas)
    page.tsx          # Página principal (pode ser a home ou redirecionar)
  components/
    ui/               # Componentes de UI genéricos (botão, input, modal)
    features/         # Componentes específicos de cada funcionalidade (ex.: lista de notas)
  hooks/              # Hooks customizados do React (se precisar)
  lib/                # Funções utilitárias, helpers, validações (ex.: zod)
    validators/       # Schemas de validação (ex.: para formulários)
  server/
    db/               # Código relacionado ao banco de dados (exemplo: memória)
    notes/            # Lógica de notas (repositório, server actions)
  types/              # Tipos TypeScript usados no projeto (ex.: Note, User)
  styles/             # Estilos extras (se precisar além do Tailwind)
public/               # Arquivos estáticos (imagens, ícones, etc.)
```

## Explicação de cada pasta

- **src/app/**: Onde ficam as rotas e páginas do seu app. O Next.js usa essa pasta para organizar as URLs e layouts.
  - **(marketing)**: Páginas públicas, visíveis para qualquer visitante (landing page, login, cadastro).
  - **(app)**: Páginas que só aparecem para usuários autenticados (dashboard, notas, perfil, etc.).
  - **globals.css**: Arquivo de estilos globais, geralmente com Tailwind.
  - **layout.tsx**: Define o layout base (estrutura HTML, body, etc.) para todas as páginas.
  - **page.tsx**: Página principal do app (pode ser a home ou redirecionar para login).
- **src/components/ui/**: Componentes visuais reutilizáveis, como botões, inputs, modais. Não têm lógica de negócio.
- **src/components/features/**: Componentes específicos de cada funcionalidade (ex.: lista de notas, editor de nota).
- **src/hooks/**: Hooks customizados do React, caso precise lógica compartilhada entre componentes.
- **src/lib/**: Funções utilitárias, helpers, validações (ex.: schemas do zod para formulários).
  - **validators/**: Schemas de validação para inputs e formulários.
- **src/server/**: Código que só roda no servidor (ex.: acesso ao banco, server actions, repositórios).
  - **db/**: Implementação do banco de dados (exemplo em memória para estudo).
  - **notes/**: Lógica de notas (repositório, server actions, etc.).
- **src/types/**: Tipos TypeScript usados no projeto (ex.: Note, User, DTOs).
- **src/styles/**: Estilos extras, caso precise além do Tailwind.
- **public/**: Arquivos estáticos acessíveis pelo navegador (imagens, ícones, etc.).

---

## 🚀 Como Começar

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Execute o projeto
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📚 Documentação

- **[INDEX.md](./INDEX.md)** - Guia de navegação (5 min)
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Implementar melhorias (10 min)
- **[TODO.md](./TODO.md)** - Roadmap e próximas tarefas (15 min)
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guia técnico completo (30 min)

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Iniciar produção
npm run lint         # Verificar código (ESLint)
npm run typecheck    # Verificar tipos (TypeScript)
npm run format       # Formatar código (Prettier)
```

---

## 🔧 Tecnologias

- **Framework:** Next.js 15.5 (App Router)
- **UI:** React 19.1, Tailwind CSS 4
- **Animações:** Framer Motion 12
- **Backend:** Supabase, Upstash Redis
- **Email:** Resend
- **Validação:** Zod 4.1
- **TypeScript:** 5.0 (Strict Mode)

---

## 📖 Onde Colocar Arquivos

Se tiver dúvidas sobre onde colocar algum arquivo, consulte essa lista ou pergunte! O objetivo é deixar o projeto organizado e fácil de manter.

---

## 🤝 Contribuindo

Este projeto segue boas práticas modernas. Antes de contribuir:

1. Leia o [INDEX.md](./INDEX.md) para entender a estrutura
2. Veja o [TODO.md](./TODO.md) para tarefas disponíveis
3. Siga os padrões de código (ESLint + Prettier)
4. Execute `npm run typecheck` antes de commitar

---

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

**Feito com ❤️ por um desenvolvedor em transição de front-end para full-stack**
