# Copilot Instructions for PlanlyNext

## Overview
PlanlyNext is a Next.js-based project designed for productivity and task management. It uses modern web technologies like React, TypeScript, Tailwind CSS, and Framer Motion. The project includes custom components for features like Gantt charts, Kanban boards, and landing pages.

## Architecture
- **Next.js (App Router):** The project uses the App Router for routing and server-side rendering.
- **Custom Components:**
  - `src/components/ui/kibo-ui/gantt`: Implements a Gantt chart with drag-and-drop functionality using `dnd-kit`.
  - `src/components/landing`: Contains landing page sections like `Hero`, `Features`, and `Contact`.
- **State Management:** Uses `jotai` for state management.
- **Styling:** Tailwind CSS is used for styling, with utility classes and custom themes.
- **Animations:** Framer Motion is used for animations and transitions.

## Developer Workflows
### Build and Run
- **Development:**
  ```bash
  npm run dev
  ```
- **Build:**
  ```bash
  npm run build
  ```
- **Start:**
  ```bash
  npm run start
  ```

### Testing
- No explicit testing framework is configured. Add one if needed.

### Linting and Formatting
- **Lint:**
  ```bash
  npm run lint
  ```
- **Format:**
  ```bash
  npm run format
  ```

## Project-Specific Conventions
- **File Structure:**
  - `src/components`: Contains reusable components.
  - `src/app`: Contains pages and layouts.
  - `src/lib`: Utility functions.
- **TypeScript:** Strict typing is enforced. Avoid using `any` unless absolutely necessary.
- **Icons:** Uses `lucide-react` for consistent iconography.
- **Images:** Use `next/image` for optimized image handling.

## External Dependencies
- **dnd-kit:** For drag-and-drop functionality.
- **jotai:** For state management.
- **Framer Motion:** For animations.
- **Tailwind CSS:** For styling.

## Examples
### Adding a New Component
1. Create the component in `src/components`.
2. Use Tailwind CSS for styling.
3. Add TypeScript types for props.

### Using State Management
```tsx
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Animations with Framer Motion
```tsx
import { motion } from 'framer-motion';

function AnimatedComponent() {
  return (
    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      Hello, World!
    </motion.div>
  );
}
```

## Key Files and Directories
- `src/components/ui/kibo-ui/gantt`: Gantt chart implementation.
- `src/components/landing`: Landing page components.
- `src/lib`: Utility functions.
- `package.json`: Scripts and dependencies.

## Notes
- Ensure all new components are typed and styled consistently.
- Follow the existing patterns for state management and animations.

## Additional Rules and Guidelines

### Security Principles
- Never expose credentials or PII.
- Use `.env` and Vercel Project Secrets for sensitive data.
- Validate RLS (Row-Level Security) when working with Supabase.

### Quality Gates
- Linting and TypeScript checks must pass before merging.
- Avoid `console.log` in production; use proper logging tools.

### Contribution Workflow
1. Align scope (bug/feature/refactor/performance).
2. List options with pros/cons and provide a recommendation.
3. Produce a small patch with testing instructions and risk analysis.
4. Ensure linting and type checks pass.
5. Open a PR with clear title/description and link to relevant documentation.

### Commit Standards
- Use conventional commit messages:
  ```
  <type>(<scope>): <description>
  ```
  Examples:
  - `feat(contact): add email validation`
  - `fix(hero): correct alignment issue`

### Developer Profile
- **Experience:** Trainee with 4 months, transitioning from front-end to full-stack.
- **Objective:** Use this project as a learning lab.
- **Needs:** Contextual explanations, best practices, and gradual evolution.

### Response Structure for AI Agents
1. Present options with pros/cons and a recommendation.
2. Provide educational explanations (what, why, best practices).
3. Confirm implementation before proceeding.
4. Deliver minimal diffs with justifications.
5. Include testing instructions and risk analysis.
6. Highlight learning points for professional growth.

Feel free to update this document as the project evolves.
