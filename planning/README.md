# Plan de Seguimiento en Tiempo Real — Fase 1: Fundamentos y Setup

> **Estado:** ✅ Completada  
> **Última actualización:** 2026-05-23

## Tareas y Estado

| Tarea | Descripción                                              | Estado        | Responsable                    |
| ----- | -------------------------------------------------------- | ------------- | ------------------------------ |
| 1     | Creación del proyecto y configuración de tooling         | ✅ Completada | Subagente 1: Initializer       |
| 2     | Configuración del Sistema de Diseño (Voltage Industrial) | ✅ Completada | Subagente 2: Design Architect  |
| 3     | Definición de arquitectura global y módulos              | ✅ Completada | Subagente 3: Backend Architect |
| 4     | Integración de tecnologías adicionales                   | ✅ Completada | Subagente 3: Backend Architect |

## Criterios de Éxito

- [x] `npm run dev` levanta el proyecto Astro sin errores.
- [x] Husky ejecuta Prettier y ESLint automáticamente al hacer commit.
- [x] Tailwind renderiza correctamente los tokens custom.
- [x] Estructura de carpetas en `src/lib/` refleja la arquitectura en capas.
- [x] Todos los archivos de planning están creados y poblados.
- [x] Zustand está instalado y el store base compila sin errores.
- [x] El SDK de R2 está instalado pero sin configuración activa todavía.

## Mejoras Post-Completada

- **ESLint Flat Config**: Migrado de `.eslintrc.cjs` a `eslint.config.mjs` para compatibilidad con ESLint v10.
- **Reglas de Espaciado**: Añadidas reglas `@stylistic/padding-line-between-statements` para forzar líneas en blanco antes de `if`, `return`, `for`, etc.
- **Prettier Plugin Tailwind**: `prettier-plugin-tailwindcss` ordena automáticamente las clases de Tailwind en archivos Astro y React.
- **Tailwind v4 Fix**: Se importó `global.css` en `Layout.astro` para que los estilos se carguen correctamente en todas las páginas.
- **ESLint Plugin Tailwind**: Desactivado temporalmente. `eslint-plugin-tailwindcss` no soporta Tailwind v4 CSS-first config todavía (seguimiento: https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/272).
- **View Transitions**: Implementado `<ClientRouter />` de `astro:transitions` en `Layout.astro` para transiciones suaves entre páginas.
- **Cursor Pointer**: Añadido `cursor: pointer` a `.btn-primary` y `.btn-secondary` en `global.css`.
- **Rutas de Design System**: Creadas `/design-system` (paleta) y `/design-system/components` (componentes).
- **Landing Invertida**: Nueva página `index.astro` con sección hero de fondo `primary-300` y texto oscuro invertido.

## Notas

- Cloudflare R2 es la fuente de verdad para imágenes (no Supabase Storage).
- Fuente tipográfica body: **Inter**.
- Librería de íconos: **lucide-react**.
- Astro version: **latest** (v6.3.7) con Tailwind v4.
- `border-radius` no se toca globalmente; se define en clases de componentes.

## Archivos de Planning Entregados

- `planning/CONTRIBUTING.md` — Convenciones de código y estructura de carpetas.
- `planning/design-system.md` — Tokens, clases y componentes base del sistema Voltage Industrial.
- `planning/architecture-overview.md` — Diagramas de flujo de datos y capas de arquitectura.
- `planning/stack-tecnologico.md` — Stack completo con versiones, justificaciones y links.

## Archivos Clave del Proyecto

- `src/lib/models/index.ts` — Interfaces TypeScript base de las 8 entidades principales.
- `src/lib/utils/errors.ts` — Clases de error custom (`AppError`, `ValidationError`, `AuthError`, `NotFoundError`).
- `src/lib/stores/workoutStore.ts` — Store Zustand base para la sesión de entreno activa.
- `src/styles/global.css` — Tokens Tailwind v4 (`@theme`) + componentes base (`@layer components`).
- `tailwind.config.mjs` — Configuración legacy compatible (no interfiere con v4).
- `src/pages/index.astro` — Landing page con sección primary invertida.
- `src/pages/design-system/index.astro` — Paleta completa de colores y tipografía.
- `src/pages/design-system/components.astro` — Showcase de componentes base.
- `src/components/ui/Button.tsx` — Componente Button reutilizable (React).
- `src/components/ui/Input.tsx` — Componente Input reutilizable (React).
- `src/components/ui/GlowEffect.tsx` — Wrapper Glow Effect reutilizable (React).
- `src/components/index.ts` — Barrel export de todos los componentes UI.
