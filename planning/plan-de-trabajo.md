# Plan de Trabajo — IRON TRACK

> Roadmap de alto nivel para el desarrollo del proyecto. Las tareas están ordenadas por dependencias lógicas y agrupadas en fases ejecutables.

---

## Fase 1: Fundamentos y Setup del Proyecto

**Objetivo:** Tener un proyecto base funcional, con tooling configurado y arquitectura clara antes de escribir lógica de negocio.

### Tarea 1: Creación del proyecto y configuración de tooling

- [ ] Inicializar proyecto Astro 4.x con integraciones React y Tailwind CSS.
- [ ] Configurar TypeScript en modo `strict`.
- [ ] Instalar y configurar Prettier con reglas del proyecto (singleQuote, trailingComma, tabWidth, etc.).
- [ ] Configurar ESLint con plugins para Astro, React Hooks y TypeScript.
- [ ] Instalar y configurar Husky (`pre-commit`) para ejecutar Prettier y lint automáticamente.
- [ ] Crear estructura base de carpetas (`src/pages/`, `src/lib/`, `src/components/`, `src/layouts/`, etc.).
- [ ] Documentar convenciones de código y estructura de carpetas en `planning/CONTRIBUTING.md`.

### Tarea 2: Configuración del Sistema de Diseño (Voltage Industrial)

- [ ] Configurar `tailwind.config` con la paleta de colores custom del proyecto:
    - `primary`: Escala 50-950 (base `#CCFF00` / `#abd600`).
    - `secondary`: Escala 50-950 (base grises cálidos / `#c8c6c5`).
    - `background`: Escala 50-950 (base `#131313` / `#000000`).
- [ ] Configurar fuentes tipográficas: `Space Grotesk`, `Inter`/`Geist`, `JetBrains Mono`.
- [ ] Definir tokens de spacing custom (8px grid, gutters responsive móvil/desktop).
- [ ] Crear componentes base reutilizables con Tailwind (`@layer components`): botones, inputs, cards glass, chips.
- [ ] Implementar efectos de diseño: glow effects (`box-shadow`), glass cards con borde sutil verde (`rgba(204,255,0,0.2)`), animaciones (`fade-in-up`).
- [ ] Documentar tokens y componentes base en `planning/design-system.md`.

### Tarea 3: Definición de arquitectura global y módulos

- [ ] Documentar los 7 módulos principales: **Auth**, **Ejercicios**, **Rutinas**, **Entrenos**, **Calendario/Historial**, **Comunidad**, **Landing**.
- [ ] Definir responsabilidades de cada módulo y sus dependencias entre sí.
- [ ] Crear diagrama de flujo de datos simplificado (usuarios → rutinas → sesiones → sets).
- [ ] Definir contratos entre capas: DTOs e interfaces base en `src/lib/models/`.

### Tarea 4: Definición e integración de tecnologías adicionales

- [ ] Evaluar e integrar **Zustand** para estado global de React (sesión de entreno activa).
- [ ] Instalar el SDK de **Cloudflare R2** (`aws-sdk` o `@aws-sdk/client-s3` compatible) para uso futuro en el módulo de Ejercicios. **Solo instalación por ahora; no crear cliente ni configurar buckets todavía.**
- [ ] Instalar dependencias de utilidades confirmadas: `date-fns`, `recharts`, `browser-image-compression`.
- [ ] Documentar stack tecnológico final consolidado en `planning/stack-tecnologico.md`.

---

## Fase 2: Diseño Conceptual del Arnés de IA

**Objetivo:** Definir la estrategia, agentes, skills y flujos de trabajo de IA **antes** de implementar la base de datos, para poder usar el arnés como guía durante el diseño del schema y el backend.

> **Nota:** Esta fase es puramente documental y de diseño. No se instala ni se ejecuta código de skills todavía.

### Tarea 5: Definición de la estrategia de IA y agentes

- [ ] Documentar el propósito del arnés: acelerar desarrollo por módulos, mantener consistencia arquitectónica, reducir errores.
- [ ] Definir los 4 agentes principales y sus responsabilidades:
    - **Planificador:** Descompone módulos grandes en tareas pequeñas y las documenta en archivos MD individuales dentro de `planning/modules/`.
    - **Implementador:** Genera código de módulos específicos siguiendo lineamientos de arquitectura en capas.
    - **Reviewer:** Revisa código contra requerimientos, estándares de código y arquitectura en capas.
    - **Investigador:** Busca patrones, librerías y soluciones para problemas técnicos emergentes.
- [ ] Definir lineamientos de prompts: contexto esperado (archivos de planning a incluir), formato de salida (código + tests + documentación), reglas de no-overengineering.
- [ ] Documentar todo en `planning/ai-harness.md`.

### Tarea 6: Diseño de skills necesarias

- [ ] Definir catálogo de skills a crear (a nivel diseño/prompts, no implementación técnica todavía):
    - `skill-astro-api-routes`: Generación de endpoints REST siguiendo la arquitectura en capas.
    - `skill-react-islands`: Creación de componentes React interactivos con Zustand.
    - `skill-supabase-schema`: Validación y evolución del schema PostgreSQL.
    - `skill-testing-backend`: Generación de tests para endpoints e inputs críticos.
- [ ] Definir para cada skill: entrada esperada, salida esperada, restricciones y contexto obligatorio.
- [ ] Definir flujo de trabajo módulo por módulo:
    1. Planificador genera el MD de tareas del módulo.
    2. Implementador ejecuta las tareas una por una.
    3. Reviewer valida el código generado.
    4. Investigador resuelve bloqueos técnicos emergentes.
- [ ] Documentar flujos en `planning/ai-workflows.md`.

---

## Fase 3: Base de Datos y Backend Base

**Objetivo:** Tener el schema de PostgreSQL completo, triggers, RLS, seed data y la arquitectura de backend desacoplada lista para consumir.

> **Nota:** El diseño del schema se realiza apoyado en el arnés conceptual definido en la Fase 2 (especialmente `skill-supabase-schema`).

### Tarea 7: Diseño e implementación de la base de datos

- [ ] Crear schema SQL completo en Supabase con todas las tablas:
      `profiles`, `exercises`, `routines`, `routine_days`, `routine_exercises`, `user_active_routine_log`, `workout_sessions`, `workout_sets`, `routine_likes`.
- [ ] Implementar constraints: PKs, FKs, partial unique index en `routines(user_id, is_active) WHERE is_active = true`, índice funcional `LOWER(name)` en `exercises`.
- [ ] Implementar triggers PostgreSQL:
    - Auto-creación de `profile` tras registro en `auth.users`.
    - Actualización atómica de `routines.likes_count` al insertar/borrar en `routine_likes`.
    - Cierre de `user_active_routine_log` anterior al activar una nueva rutina.
- [ ] Configurar RLS policies en todas las tablas protegidas (`routines`, `workout_sessions`, `workout_sets`, `profiles`, `user_active_routine_log`).
- [ ] Crear seed data: **30+ ejercicios preestablecidos** y **2-3 rutinas de ejemplo** listas para usar.
- [ ] Documentar schema, índices y triggers en `planning/database-schema.md`.

### Tarea 8: Implementación de la arquitectura de backend en capas

- [ ] Crear cliente Supabase server-side con `service_role_key` en `src/lib/db/supabase.ts`.
- [ ] Implementar capa de Repositories (`src/lib/repositories/`): un archivo por entidad principal (queries directas a BD).
- [ ] Implementar capa de Services (`src/lib/services/`): lógica de negocio base (validaciones, cálculo de inasistencias, reglas de activación, etc.).
- [ ] Implementar capa de DTOs/Models (`src/lib/models/`) con tipado estricto TypeScript.
- [ ] Crear utilidades de error handling (`src/lib/utils/errors.ts`) con clases custom (`AppError`, `ValidationError`, `AuthError`).
- [ ] Implementar middleware de Astro para protección de rutas (verificación de sesión en server-side).

---

## Fase 4: Meta-herramientas Técnicas

**Objetivo:** Implementar técnicamente las skills de IA y configurar el entorno de testing para acelerar el desarrollo por módulos.

> **Nota:** A diferencia de la Fase 2, aquí se instala, configura y ejecuta código real de skills y tests.

### Tarea 9: Implementación técnica del arnés de IA

- [ ] Instalar el sistema de skills del entorno de IA (OpenCode o herramienta elegida).
- [ ] Crear los archivos de skills definidos en la Fase 2 (`skill-astro-api-routes`, `skill-react-islands`, `skill-supabase-schema`, `skill-testing-backend`).
- [ ] Configurar los agentes con sus prompts, contexto y reglas específicas.
- [ ] Validar que el arnés puede generar código acorde a la arquitectura en capas y al schema de BD ya existente.
- [ ] Documentar instalación y uso del arnés en `planning/ai-harness-technical.md`.

### Tarea 10: Testing de partes críticas

- [ ] Configurar framework de testing backend (Vitest para lógica de negocio; estrategia de test DB o mocks para Supabase).
- [ ] Implementar tests para:
    - **Reglas de RLS:** usuarios no pueden ver/modificar datos de otros usuarios.
    - **Endpoints de autenticación:** registro, login, logout, protección de rutas.
    - **Endpoints de rutinas:** soft delete, activación única, duplicación, cambio de rutina activa.
    - **Endpoints de entrenos:** batch de sets, fecha editable, transición draft → completed.
    - **Inputs críticos:** validación de peso/reps (números positivos), sanitización de nombres, prevención de XSS en notas.
- [ ] Integrar tests en el pipeline de Husky (ejecutar en `pre-push` de forma opcional o obligatoria según velocidad).
- [ ] Documentar estrategia de testing, cobertura esperada y cómo ejecutarlos en `planning/testing-strategy.md`.

---

## Fase 5: Desarrollo por Módulos

**Objetivo:** Construir la aplicación funcional pieza por pieza, usando las herramientas preparadas.

> **Nota:** Cada módulo se desarrolla siguiendo el lineamiento del **Planificador** de IA. El Planificador descompone cada módulo en tareas pequeñas y las documenta en archivos MD individuales dentro de `planning/modules/`.

### Módulo 1: Autenticación y Perfiles

- [ ] UI de Login y Registro (React islands con validación).
- [ ] Integración completa con Supabase Auth (email/contraseña).
- [ ] Middleware de Astro para protección de rutas del dashboard.
- [ ] Página de perfil básico (nombre, avatar, rol).
- [ ] Logout y recuperación de contraseña (flujo básico).

### Módulo 2: Biblioteca de Ejercicios

- [ ] Listado de ejercicios aprobados (Server Islands para lectura pública, sin JS).
- [ ] Buscador de ejercicios con sugerencia de coincidencias.
- [ ] Formulario de propuesta de ejercicio: nombre, imagen (con compresión previa al upload).
- [ ] Flujo de aprobación (admin): ver ejercicios `pending` y actualizar a `approved`.
- [ ] Integración con Storage (Supabase o Cloudflare R2) para imágenes.

### Módulo 3: Gestión de Rutinas

- [ ] CRUD de rutinas personales (crear, renombrar, eliminar con soft delete).
- [ ] Configuración de días de la semana: activar/desactivar días, asignar `day_name` personalizado.
- [ ] Asignación ordenada de ejercicios a cada día (drag-and-drop o botones de orden).
- [ ] Activación de rutina: cambiar `is_active`, registrar en `user_active_routine_log`.
- [ ] Regla de inmutabilidad: si una rutina tiene sesiones, solo se puede duplicar para editar.

### Módulo 4: Registro de Entrenos

- [ ] Vista de rutina activa filtrada por día de la semana.
- [ ] Formulario de batch de series por ejercicio: reps, peso (kg), nota opcional por serie.
- [ ] Guardado progresivo: al terminar un ejercicio, se envían todas sus series vía API Route.
- [ ] Temporizador de descanso local entre series y ejercicios.
- [ ] Finalización de sesión: cambio de `draft` a `completed`, sesión ya no editable.
- [ ] Registro retroactivo: permitir seleccionar `session_date` distinta a la fecha actual al iniciar sesión.

### Módulo 5: Calendario, Historial y Asistencias

- [ ] Vista calendario mensual (indicadores: completado, inasistencia, descanso, futuro).
- [ ] Cálculo de inasistencias: comparar días programados de la rutina activa histórica contra sesiones existentes.
- [ ] Detalle de sesión al clicar un día: ver/editar (solo draft) / crear retroactiva.
- [ ] Historial por ejercicio: lista detallada filtrable por rango de fechas.
- [ ] Gráficos de progreso (Recharts): peso máximo, volumen total, evolución temporal.
- [ ] Cálculo de PRs automáticos y métricas agregadas (peso máximo histórico, frecuencia semanal).

### Módulo 6: Feed Comunitario

- [ ] Publicar una rutina personal como pública (`is_public = true`).
- [ ] Listado de rutinas públicas con ordenamiento por fecha y likes.
- [ ] Sistema de likes: solo usuarios autenticados; un like por usuario/rutina.
- [ ] Copiar rutina pública al perfil personal (deep copy de rutina + días + ejercicios).
- [ ] Contadores de likes actualizados en tiempo real (o con invalidación de caché).

### Módulo 7: Landing Page

- [ ] Secciones estáticas con Server Islands (zero JS en el cliente).
- [ ] Imágenes de gimnasio optimizadas con componente `<Image>` de Astro.
- [ ] Propuesta de valor, funcionalidades destacadas y testimonios (futuro).
- [ ] CTAs claros a Login y Registro.
- [ ] SEO básico: meta tags, Open Graph, sitemap.

---

## Reglas de Dependencias

| Fase       | Requisitos previos | Por qué                                                                                                                                                           |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fase 1** | Ninguno            | Es el punto de partida.                                                                                                                                           |
| **Fase 2** | Fase 1 completada  | Necesitamos la arquitectura y stack definidos para diseñar el arnés de IA con contexto real.                                                                      |
| **Fase 3** | Fase 2 completada  | El diseño del schema se apoya en el arnés conceptual (especialmente `skill-supabase-schema`). El backend en capas se construye sobre el proyecto ya inicializado. |
| **Fase 4** | Fase 3 completada  | La implementación técnica de skills necesita el schema real y el backend base. Los tests necesitan código que validar.                                            |
| **Fase 5** | Fase 4 completada  | Los módulos se desarrollan con las herramientas de IA, testing e infraestructura listos.                                                                          |

> **Dentro de la Fase 5**, el orden de módulos es estricto: Auth debe estar antes que Ejercicios, Ejercicios antes que Rutinas, Rutinas antes que Entrenos, y Entrenos antes que Calendario/Historial. Comunidad y Landing pueden desarrollarse en paralelo una vez Auth y Rutinas estén listos.

---

## Tareas Transversales (aplican a toda la Fase 5)

- [ ] **Responsive:** Verificar mobile-first en cada módulo desarrollado.
- [ ] **Accesibilidad:** Contraste, etiquetas ARIA, navegación por teclado en cada formulario.
- [ ] **Documentación:** Actualizar `planning/` cuando cambie cualquier decisión técnica o requerimiento.
- [ ] **Revisión de código:** Usar el agente **Reviewer** tras completar cada módulo.
- [ ] **Uso del arnés de IA:** Seguir el flujo definido en la Fase 2 (Planificador → Implementador → Reviewer → Investigador) para cada módulo.

---

_Plan de trabajo generado para el proyecto IRON TRACK._
_Este documento es vivo: se actualiza conforme avanza el desarrollo y surgen nuevas necesidades._
