# IRON TRACK — Fuente de Verdad Completa

Este documento es el arnés maestro que debe consultarse antes de cualquier tarea en el proyecto IRON TRACK.

---

## Sección 1: Identidad del Proyecto

- **Nombre:** IRON TRACK
- **Propósito:** Seguimiento de entrenamiento en gimnasio. Gestiona rutinas, ejercicios, sesiones en vivo, historial de progreso y comunidad de atletas.
- **Audiencia:** Atletas de gimnasio que desean registrar, planificar y analizar sus entrenamientos de forma estructurada.

---

## Sección 2: Stack Tecnológico

| Tecnología                         | Versión                                | Rol                                              |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------ |
| Astro                              | `^6.3.7`                               | Framework principal (SSR/SSG, API Routes)        |
| React                              | `^19.2.6`                              | Islands de interactividad                        |
| React DOM                          | `^19.2.6`                              | Renderizado React                                |
| Tailwind CSS                       | `^4.3.0`                               | Estilos y design tokens                          |
| @tailwindcss/vite                  | `^4.3.0`                               | Integración Tailwind + Vite                      |
| TypeScript                         | `6.0.3`                                | Tipado estricto en todo el proyecto              |
| @astrojs/react                     | `^5.0.5`                               | Adapter React para Astro                         |
| Zustand                            | `^5.0.13`                              | Estado global ligero (workout activo únicamente) |
| date-fns                           | `^4.3.0`                               | Manipulación de fechas                           |
| recharts                           | `^3.8.1`                               | Gráficos de progreso                             |
| browser-image-compression          | `^2.0.2`                               | Compresión de imágenes en cliente                |
| lucide-react                       | `^1.16.0`                              | Iconos                                           |
| @aws-sdk/client-s3                 | `^3.1053.0`                            | Cliente S3 para Cloudflare R2                    |
| Supabase (`@supabase/supabase-js`) | Pendiente de instalación (módulo Auth) | Auth, PostgreSQL, RLS                            |
| Prettier                           | `^3.8.3`                               | Formateo de código                               |
| prettier-plugin-astro              | `^0.14.1`                              | Soporte Astro para Prettier                      |
| prettier-plugin-tailwindcss        | `^0.8.0`                               | Orden de clases Tailwind en Prettier             |
| ESLint                             | `^10.4.0` (Flat Config)                | Linting                                          |
| @typescript-eslint/eslint-plugin   | `^8.59.4`                              | Reglas TypeScript para ESLint                    |
| @typescript-eslint/parser          | `^8.59.4`                              | Parser TypeScript para ESLint                    |
| eslint-plugin-astro                | `^1.7.0`                               | Reglas Astro para ESLint                         |
| eslint-plugin-react-hooks          | `^7.1.1`                               | Reglas React Hooks para ESLint                   |
| Husky                              | `^9.1.7`                               | Git hooks                                        |
| lint-staged                        | `^17.0.5`                              | Linting en archivos staged                       |
| Vitest                             | No instalado (Fase 4)                  | Testing unitario                                 |

---

## Sección 3: Arquitectura de Backend

### API Routes como única vía para mutaciones

- Todas las mutaciones (crear, actualizar, eliminar) **deben pasar por Astro API Routes** (`src/pages/api/*`).
- **NO se usan Server Actions de Astro.**
- **NO se usan formActions.**
- Los componentes cliente realizan `fetch()` a los endpoints correspondientes.

### Server Islands

- Las Astro Server Islands se usan **exclusivamente para presentación/lectura estática**.
- No realizan mutaciones ni cambios de estado.

### Capas estrictas

```
Controllers (API Routes) → Services → Repositories → Models
```

| Capa                               | Responsabilidad                                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Controllers (Astro API Routes)** | Manejan HTTP: parsean y validan input, extraen cookies/headers, invocan el Service adecuado y devuelven JSON. **Nunca contienen lógica de negocio ni llamadas directas a la base de datos.**           |
| **Services**                       | Contienen toda la lógica de negocio, orquestación y reglas de validación. Transforman datos crudos en resultados de dominio. Son los guardianes de las reglas del negocio.                             |
| **Repositories**                   | Abstraen todo el acceso a datos. Comunican directamente con Supabase (PostgreSQL) vía SQL, RPC o el cliente de Supabase. Devuelven datos tipados (usando Models) y manejan la construcción de queries. |
| **Models**                         | Interfaces puras de TypeScript que definen la forma de los datos que fluyen por el sistema. Garantizan type safety entre capas.                                                                        |

### Flujo de datos principal

```
usuarios → rutinas → sesiones → sets
```

### Errores custom

- `AppError`: Error genérico de aplicación.
- `ValidationError`: Error de validación de input.
- `AuthError`: Error de autenticación o autorización.
- `NotFoundError`: Recurso no encontrado.

---

## Sección 4: Design System — Voltage Industrial

### Filosofía

Fusión de **Industrial Brutalism** (utilidad cruda, bordes afilados, tipografía de alto contraste) y **Cyber-Minimalism** (paleta restringida, espaciado preciso, acentos neón sutiles).

### Modo oscuro absoluto

- Dark Mode Only. No existe light mode ni toggle de tema.
- Canvas oscuro absoluto: `#131313`, `#000000`.

### Border Radius

- **0px Border Radius Global** por defecto.
- Si un componente necesita redondeo, se declara explícitamente en ese componente.

### Sombras

- **No sombras.** La profundidad se crea por Tonal Layering y Bordes Gruesos.

### Grid de espaciado

- Basado en unidad de **8px**.

### Paleta principal

- **Primary:** `#CCFF00` (acid-lime) — CTAs, highlights, acentos de energía.
- **Secondary:** `#c8c6c5` (warm grey) — bordes, texto secundario, elementos estructurales.
- **Background:** `#131313` / `#000000` — canvas de toda la aplicación.

### Tipografía

- **Display:** `Space Grotesk`, sans-serif — headings, marca, hero text.
- **Body:** `Inter` / `Geist`, sans-serif — texto de UI, párrafos, labels.
- **Mono:** `JetBrains Mono`, monospace — stats, timers, datos tipo código.

### Componentes base

```css
/* .btn-primary */
@apply bg-primary-400 border-primary-400 border-2 px-6 py-3 font-bold text-black transition-all duration-200;
/* hover: */
@apply bg-primary-300;

/* .btn-secondary */
@apply text-secondary-200 border-secondary-400 border-2 bg-transparent px-6 py-3 font-bold transition-all duration-200;
/* hover: */
@apply bg-secondary-400 text-black;

/* .input-field */
@apply bg-background-800 border-secondary-700 focus:border-primary-400 w-full border-2 px-4 py-3 text-white transition-colors focus:outline-none;

/* .card-glass */
@apply bg-background-800/80 border-primary-400/20 border backdrop-blur-md;

/* .glow-primary */
box-shadow: 0 0 25px rgba(204, 255, 0, 0.3);
```

---

## Sección 5: Reglas Críticas (HARD-GATES)

1. **NO Server Actions.** Toda mutación pasa por API Routes (`src/pages/api/*`).
2. **Todos los archivos `.ts` / `.tsx` en strict mode.** Tipado explícito obligatorio.
3. **Soft deletes.** No se hacen hard deletes en datos de usuario.
4. **Mobile First.** Todo diseño parte de mobile y escala hacia arriba.
5. **No usar `var`.** Preferir `const`; usar `let` solo cuando la reasignación sea necesaria.
6. **Usar `async/await`** sobre promises crudos cuando sea posible.
7. **ESLint y Prettier** deben pasar antes de cualquier commit (Husky + lint-staged).

---

## Sección 6: Estructura de Carpetas

```
src/
├── components/
│   ├── ui/           # Primitivos compartidos: Button, Input, Card
│   ├── forms/        # Componentes de formulario compuestos
│   ├── layout/       # Navbar, Sidebar, Footer
│   └── features/     # Componentes específicos por módulo
├── pages/
│   └── api/          # Endpoints REST (Controllers)
├── lib/
│   ├── db/           # Cliente de base de datos / setup de Supabase
│   ├── repositories/ # Capa de acceso a datos
│   ├── services/     # Lógica de negocio
│   ├── models/       # Tipos, interfaces, DTOs
│   └── utils/        # Funciones helper compartidas
└── styles/
    └── ...           # Global CSS / Tailwind entry
```

---

## Sección 7: Convenciones de Nomenclatura

| Categoría                 | Convención | Ejemplo                               |
| ------------------------- | ---------- | ------------------------------------- |
| Componentes React / Astro | PascalCase | `WorkoutCard.tsx`, `BaseLayout.astro` |
| Funciones y variables     | camelCase  | `getWorkoutById`, `sessionDate`       |
| Archivos (no componentes) | kebab-case | `api-client.ts`, `use-auth.ts`        |
| Tipos / Interfaces        | PascalCase | `WorkoutSession`, `UserProfile`       |

---

## Sección 8: Cómo usar el Arnés

- **Para desarrollo de features:** consulta `harness/workflows/feature-development.md`.
- **Para bug fixes:** consulta `harness/workflows/bug-fix.md`.
- **Para refactors:** consulta `harness/workflows/refactor.md`.
- **Prompts de subagentes:** ubicados en `harness/prompts/`.
- **Skills propias:** se activan automáticamente (`iron-track-architecture-guardian`, `iron-track-design-guardian`).

---

## Sección 9: Idioma

- Todo el código, commits, documentación y comunicación con el usuario debe ser en **español**, salvo términos técnicos estándar (handler, repository, service, controller, etc.).
