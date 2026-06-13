# IRON TRACK — Estructura de Carpetas

Referencia completa del árbol de directorios del proyecto y la responsabilidad de cada carpeta.

## Árbol General del Proyecto

```
gym-project/
├── .astro/                      # Cache y build interno de Astro (no tocar)
├── .config/                     # Configuraciones auxiliares del entorno
├── .husky/                      # Git hooks (pre-commit con Prettier + ESLint)
├── .opencode/
│   └── skills/
│       └── iron-track-architecture-guardian/  # Skill de arquitectura del agente
│           ├── SKILL.md
│           └── references/
│               └── folder-structure.md
├── .vscode/                     # Configuración de VS Code (settings, extensiones recomendadas)
├── docs/                        # Documentación del proyecto
│   ├── architecture-overview.md
│   ├── CONTRIBUTING.md
│   ├── design-system.md
│   ├── obtencion-requerimientos.md
│   ├── skills-fundamentales.md
│   └── stack-tecnologico.md
├── harness/                     # Prompts y workflows del agente AI
│   ├── AGENTS.md
│   ├── prompts/
│   └── workflows/
├── planning/                    # Planificación de fases y módulos
│   ├── ejemplos-diseño/
│   ├── fase-2-ai-harness-plan.md
│   ├── mas.md
│   ├── modules/
│   │   ├── module-01-auth/
│   │   ├── module-02-exercises/
│   │   ├── module-03-routines/
│   │   ├── module-04-workouts/
│   │   ├── module-05-calendar/
│   │   ├── module-06-community/
│   │   └── module-07-landing/
│   ├── plan-de-trabajo.md
│   └── README.md
├── public/                      # Assets estáticos (imágenes, fuentes, favicon)
├── src/
│   ├── components/
│   │   ├── ui/                  # Primitivos UI compartidos (100% presentacionales)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── GlowEffect.tsx
│   │   │   └── Input.tsx
│   │   ├── forms/               # Componentes de formulario compuestos (layouts de inputs, validaciones visuales)
│   │   ├── layout/              # Layouts reutilizables (Navbar, Sidebar, Footer)
│   │   ├── features/            # Componentes específicos de cada módulo de dominio
│   │   │   ├── auth/
│   │   │   ├── exercises/
│   │   │   ├── routines/
│   │   │   ├── workouts/
│   │   │   ├── calendar/
│   │   │   ├── community/
│   │   │   └── landing/
│   │   └── index.ts             # Barrel export de componentes compartidos
│   ├── layouts/
│   │   └── Layout.astro         # Layout base de Astro (meta tags, estructura HTML)
│   ├── lib/
│   │   ├── db/                  # Cliente Supabase y configuración de conexión a PostgreSQL
│   │   ├── models/              # Tipos, interfaces y DTOs compartidos entre capas
│   │   │   └── index.ts
│   │   ├── repositories/        # Capa de acceso a datos (queries SQL/RPC a Supabase)
│   │   ├── services/            # Capa de lógica de negocio (reglas, validaciones, orquestación)
│   │   ├── stores/              # Estado global con Zustand (solo workout activo)
│   │   │   └── workoutStore.ts
│   │   └── utils/               # Helpers y funciones utilitarias compartidas
│   │       └── errors.ts        # Clases custom de error (AppError, ValidationError, etc.)
│   ├── pages/
│   │   ├── api/                 # Endpoints REST de Astro (Controllers / API Routes)
│   │   ├── design-system/       # Páginas de demostración del design system
│   │   └── index.astro          # Página de inicio (landing)
│   └── styles/
│       └── global.css           # CSS global y entry point de Tailwind
├── astro.config.mjs             # Configuración de Astro
├── tailwind.config.mjs          # Configuración de Tailwind CSS
├── tsconfig.json                # Configuración de TypeScript (strict mode)
├── eslint.config.mjs            # Configuración de ESLint
├── .prettierrc                  # Configuración de Prettier
├── package.json                 # Dependencias y scripts del proyecto
├── pnpm-lock.yaml               # Lockfile de pnpm
├── vercel.json                  # Configuración de deploy en Vercel
├── AGENTS.md                    # Instrucciones iniciales para el agente
├── README.md                    # README público del proyecto
└── CONTRIBUTING.md              # Guía de contribución (sin uso directo, info duplicada en docs/)
```

## Descripción por Carpeta

### `src/components/`
Contiene todos los componentes visuales del proyecto, organizados por nivel de abstracción y dominio.

- **`src/components/ui/`** — Primitivos UI compartidos (Button, Input, Card, Checkbox, Toast, Spinner, Badge). Deben ser 100% presentacionales: sin lógica de negocio, sin fetch, sin estado global.
- **`src/components/forms/`** — Componentes de formulario compuestos, como grupos de inputs, form layouts o wrappers de validación visual.
- **`src/components/layout/`** — Elementos estructurales reutilizables: Navbar, Sidebar, Footer, etc.
- **`src/components/features/<modulo>/`** — Componentes específicos de cada módulo (auth, exercises, routines, workouts, calendar, community, landing). Cada subcarpeta agrupa la UI de su dominio.

### `src/layouts/`
Layouts base de Astro que envuelven páginas enteras. Ejemplo: `Layout.astro` con meta tags, HTML semántico y slots.

### `src/lib/`
Código de servidor y lógica compartida, estrictamente organizado en capas.

- **`src/lib/db/`** — Configuración del cliente de Supabase (`@supabase/supabase-js`) y helpers de conexión a PostgreSQL.
- **`src/lib/models/`** — Definiciones TypeScript puras: interfaces, tipos y DTOs. Son el contrato de datos entre capas.
- **`src/lib/repositories/`** — Capa de acceso a datos. Cada archivo encapsula queries a Supabase (SQL, RPC, o cliente JS). Devuelven tipos definidos en `models/`.
- **`src/lib/services/`** — Capa de lógica de negocio. Orquestan llamadas a repositories, aplican reglas de dominio y transforman datos.
- **`src/lib/stores/`** — Stores de Zustand. Uso restringido al estado del workout activo. No usar para estado global arbitrario.
- **`src/lib/utils/`** — Funciones helper genéricas y clases de error custom (`errors.ts`).

### `src/pages/`
Páginas de Astro y API Routes.

- **`src/pages/api/`** — Endpoints REST. Son los Controllers de la arquitectura. Reciben HTTP, validan input, llaman a Services y devuelven JSON. **Única vía permitida para mutaciones.**
- **`src/pages/design-system/`** — Páginas de documentación visual interna para probar componentes UI.
- **`src/pages/index.astro`** — Landing page principal.

### `src/styles/`
Archivos CSS globales. `global.css` es el entry point que importa Tailwind.

### `docs/`
Documentación del proyecto legible por humanos y agentes: arquitectura, contributing, stack tecnológico, requerimientos, design system y skills fundamentales.

### `harness/`
Prompts especializados y workflows del agente AI. Leer `harness/AGENTS.md` para contexto completo de reglas de arquitectura y design system.

### `planning/`
Planificación del desarrollo por fases y módulos. Contiene el plan de trabajo y una carpeta `modules/` con un subdirectorio por cada uno de los 7 módulos core del sistema.

### `.opencode/skills/`
Skills instalables para el agente OpenCode. Cada skill tiene su propio `SKILL.md` y carpeta `references/`.
