---
name: iron-track-architecture-guardian
description: >-
  Enforce IRON TRACK's strict layered architecture, folder conventions, and coding rules. Use this skill whenever creating, modifying, or reviewing backend code, API routes, services, repositories, models, or any file in src/lib/ or src/pages/api/. Also use when suggesting file placement, naming conventions, or architectural decisions. This skill ensures NO Server Actions, proper layer separation, and correct folder structure.
---

# IRON TRACK — Architecture Guardian

Skill para garantizar que todo código generado o modificado respete la arquitectura en capas estricta, las convenciones de nomenclatura y las reglas de organización del proyecto IRON TRACK.

## 1. Arquitectura en Capas Estricta

El flujo de una petición sigue siempre este diagrama:

```
Cliente
   │
   ▼
Astro API Route (Controller)
   │
   ▼
Service Layer (src/lib/services/)
   │
   ▼
Repository Layer (src/lib/repositories/)
   │
   ▼
Supabase PostgreSQL
```

**Reglas de capas:**

- **Controller (API Route)**: Recibe la petición HTTP, valida y parsea el input, extrae cookies/headers, llama al Service apropiado y devuelve una respuesta JSON. **NUNCA** debe contener lógica de negocio ni hacer llamadas directas a la base de datos.
- **Service**: Contiene toda la lógica de negocio, orquestación y reglas de validación. Llama a Repositories para obtener o persistir datos. Transforma datos crudos en resultados de dominio. Es el guardian de las reglas del negocio.
- **Repository**: Abstrae todo el acceso a datos. Se comunica directamente con Supabase (PostgreSQL) vía SQL, RPC o el cliente de Supabase. Devuelve datos tipados (usando Models) y maneja la construcción de queries.
- **Model**: Interfaces TypeScript puras que definen la forma de los datos que fluyen por el sistema. Son compartidas entre capas para garantizar type safety.

**Prohibición absoluta de saltos de capa:**

- Un Controller NO puede importar ni usar directamente un Repository.
- Un Service NO puede importar directamente de `supabase` (el cliente Supabase); debe usar siempre un Repository.
- Las capas solo pueden comunicarse con la capa inmediatamente inferior.

## 2. NO Server Actions

- **Prohibición absoluta** de Astro Server Actions, `formAction`, o cualquier patrón similar.
- **Toda mutación** (crear, actualizar, eliminar) debe pasar obligatoriamente por `src/pages/api/*`.
- Los componentes cliente deben llamar a los endpoints vía `fetch()`.
- Las Server Islands de Astro se usan **ÚNICAMENTE** para presentación estática o lectura de datos. **NUNCA** para mutaciones.

## 3. Estructura de Carpetas

Ubicación obligatoria de cada tipo de archivo:

| Tipo de archivo | Carpeta |
| --------------- | ------- |
| Primitivos UI compartidos (Button, Input, Card, Checkbox, Toast, Spinner, Badge) | `src/components/ui/` |
| Componentes de formulario compuestos | `src/components/forms/` |
| Layouts (Navbar, Sidebar, Footer, Layout.astro) | `src/components/layout/` o `src/layouts/` |
| Componentes específicos de dominio/feature | `src/components/features/<modulo>/` |
| Endpoints REST (API Routes) | `src/pages/api/` |
| Lógica de negocio | `src/lib/services/` |
| Acceso a datos | `src/lib/repositories/` |
| Tipos, interfaces, DTOs | `src/lib/models/` |
| Helpers y utilidades | `src/lib/utils/` |
| Cliente Supabase / setup DB | `src/lib/db/` |
| Estado global (Zustand, solo workout activo) | `src/lib/stores/` |
| Estilos globales / Tailwind entry | `src/styles/` |

## 4. Convenciones de Nomenclatura

| Categoría | Convención | Ejemplo |
| --------- | ---------- | ------- |
| Componentes React / Astro | PascalCase | `WorkoutCard.tsx`, `BaseLayout.astro` |
| Funciones y variables | camelCase | `getWorkoutById`, `sessionDate` |
| Archivos que NO son componentes | kebab-case | `api-client.ts`, `use-auth.ts` |
| Tipos / Interfaces | PascalCase | `WorkoutSession`, `UserProfile` |

## 5. Reglas de Componentes UI

- Si un componente es un **primitivo visual** (Button, Input, Card, Checkbox, Toast, Spinner, Badge) → debe ir en `src/components/ui/`.
- Todo componente en `src/components/ui/` debe ser **100% presentacional**:
  - Sin lógica de negocio.
  - Sin fetch de datos.
  - Sin dependencia de Zustand ni estado global.
- **Antes de crear un nuevo componente en `src/components/ui/`**, verificar que no exista ya uno equivalente en esa carpeta.
- Componentes específicos de un módulo o feature van en `src/components/features/<modulo>/`.

## 6. Manejo de Errores

- Usar siempre las clases de error custom definidas en `src/lib/utils/errors.ts`:
  - `AppError`
  - `ValidationError`
  - `AuthError`
  - `NotFoundError`
- No lanzar errores genéricos de tipo `Error` con mensajes sueltos.
- Los Services deben capturar errores de Repository y transformarlos en instancias de las clases custom cuando sea necesario.
- Los Controllers deben responder con códigos HTTP apropiados según el tipo de error (400 para ValidationError, 401 para AuthError, 404 para NotFoundError, 500 para AppError inesperado).

## 7. TypeScript Strict

- El proyecto usa **TypeScript en modo strict**.
- Tipos explícitos obligatorios en:
  - Parámetros de funciones.
  - Valores de retorno.
  - Objetos complejos (DTOs, payloads).
- Evitar `any`. Usar `unknown` con type narrowing cuando sea necesario.
- Preferir `const` y `let` sobre `var`.
- Usar async/await sobre promesas crudas cuando sea posible.

## 8. Pre-flight Check Arquitectónico

Antes de finalizar cualquier cambio (creación, modificación o revisión de código), verificar:

- [ ] **¿El nuevo archivo está en la carpeta correcta?** (Ver sección 3)
- [ ] **¿No hay Server Actions?** (Ver sección 2)
- [ ] **¿Las capas están respetadas?** Controller → Service → Repository (Ver sección 1)
- [ ] **¿Los nombres siguen la convención?** (Ver sección 4)
- [ ] **¿Hay manejo de errores con clases custom?** (Ver sección 6)
- [ ] **¿Los componentes UI son 100% presentacionales?** (Ver sección 5)
- [ ] **¿El código pasa el modo strict de TypeScript?** (Ver sección 7)

> Si alguna casilla no se cumple, corrige antes de entregar el código. Este skill se activa en cada interacción de creación o modificación de código backend, APIs, servicios, repositorios, modelos o cualquier archivo bajo `src/lib/` y `src/pages/api/`.
