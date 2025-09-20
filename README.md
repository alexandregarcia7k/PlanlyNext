# Estrutura de Pastas do Projeto

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

Se tiver dúvidas sobre onde colocar algum arquivo, consulte essa lista ou pergunte! O objetivo é deixar o projeto organizado e fácil de manter.
