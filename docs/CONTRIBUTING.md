# IRON TRACK - Contributing Guide

## Code Conventions

- **TypeScript strict mode** is enabled. Always provide explicit types for function parameters, return values, and complex objects.
- **ESLint** rules must pass before any commit. The pre-commit hook enforces this automatically.
- Prefer `const` and `let` over `var`.
- Use async/await over raw promises when possible.

## Folder Structure & Architecture Layers

We follow a layered architecture to keep the codebase maintainable and testable:

```
src/
├── pages/           # Astro pages + API Routes
│   └── api/         # Server endpoints (mutations & queries)
├── components/      # React & Astro UI components
├── layouts/         # Astro layout wrappers
├── lib/
│   ├── db/          # Database client / connection setup (Supabase)
│   ├── repositories/# Data access layer (direct DB / external calls)
│   ├── services/    # Business logic layer
│   ├── models/      # TypeScript types, interfaces, DTOs
│   └── utils/       # Shared helper functions
└── styles/          # Global CSS / Tailwind entry
```

**Flow:**
`pages/api/*` → `services/*` → `repositories/*` → `models/*`

## Commit Conventions

- Husky runs **Prettier** and **ESLint** on every `pre-commit` via `lint-staged`.
- Make small, focused commits with descriptive messages.
- Example: `feat: add workout session creation endpoint`

## Naming Conventions

| Category                   | Convention | Example                               |
| -------------------------- | ---------- | ------------------------------------- |
| React / Astro components   | PascalCase | `WorkoutCard.tsx`, `BaseLayout.astro` |
| Functions & variables      | camelCase  | `getWorkoutById`, `sessionDate`       |
| File names (non-component) | kebab-case | `api-client.ts`, `use-auth.ts`        |
| Types / Interfaces         | PascalCase | `WorkoutSession`, `UserProfile`       |

## No Server Actions Policy

**All mutations must go through API Routes** (`src/pages/api/`).

- Do **not** use Astro Server Actions or `formAction` patterns.
- Client components should call `fetch()` to the corresponding API route.
- This keeps business logic centralized and makes testing straightforward.
