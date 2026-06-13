# Skills Fundamentales — IRON TRACK

> **Propósito:** Listado de capacidades técnicas necesarias para el desarrollo del proyecto, alineadas al stack Astro + React + Tailwind CSS + Supabase.

---

## 1. Astro Islands Architecture

**Descripción:** Comprender el modelo de arquitectura de islas de Astro para minimizar la cantidad de JavaScript enviado al cliente.

**Aplicación en el proyecto:**

- La **Landing Page** debe ser estática por defecte, con mínima o nula hidratación de JavaScript.
- El **Dashboard** y las funcionalidades de registro de entreno deben usar **React islands** (`client:load`, `client:visible`, `client:media`) para la interactividad.
- Las páginas protegidas (dashboard, historial) deben verificar sesión en el servidor (Astro) antes de renderizar.
- **Server Islands de Astro:** Se usan exclusivamente para **presentación y lectura** (renderizado de HTML estático en el servidor). Ejemplos: secciones de landing, listados de feed público, resúmenes de estadísticas. No realizan mutaciones de datos ni conectan directamente a Supabase para escritura.
- **No se utilizarán Server Actions** de Astro. Toda mutación pasa por API Routes para mantener el backend desacoplado y portable.

**Recursos clave:**

- [Astro Islands Documentation](https://docs.astro.build/en/concepts/islands/)
- [Astro Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Astro Server Islands](https://docs.astro.build/en/guides/server-islands/)

---

## 2. Supabase Auth & Session Management

**Descripción:** Implementar autenticación completa (registro, login, logout, recuperación de contraseña) y gestionar el estado de sesión entre el servidor (Astro) y el cliente (React).

**Aplicación en el proyecto:**

- Registro e inicio de sesión con email/contraseña.
- Middleware de Astro para proteger rutas del dashboard.
- Sincronización de sesión entre server-side rendering y client-side islands.
- Roles de usuario preparados en `profiles.role` (`user`, `admin`).
- Las API Routes verifican el token de sesión antes de procesar requests protegidos.

**Recursos clave:**

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Astro + Supabase Auth Helpers](https://supabase.com/docs/guides/getting-started/tutorials/with-astro)

---

## 3. Supabase Row Level Security (RLS)

**Descripción:** Configurar políticas de seguridad a nivel de fila en PostgreSQL para garantizar que los usuarios solo accedan a sus propios datos.

**Aplicación en el proyecto:**

- `profiles`: Lectura pública (solo datos básicos), edición solo por el dueño.
- `routines`: Lectura/escritura solo por el dueño; lectura pública si `is_public = true`.
- `workout_sessions` / `workout_sets`: Lectura/escritura **exclusiva** del usuario propietario.
- `exercises` (`approved`): Lectura pública para todos; escritura solo para autenticados (con restricciones de propiedad/admin).
- `routine_likes`: Lectura pública; escritura solo por el usuario que da like.
- `user_active_routine_log`: Lectura/escritura exclusiva del usuario propietario.

**Recursos clave:**

- [Supabase RLS Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [RLS Policies Examples](https://supabase.com/docs/guides/auth/row-level-security)

---

## 4. Supabase PostgreSQL & Relaciones Complejas

**Descripción:** Diseñar y manejar un esquema relacional con múltiples niveles de anidación y lógica avanzada de base de datos.

**Aplicación en el proyecto:**

- Modelo jerárquico: `routines` → `routine_days` → `routine_exercises`.
- Modelo de registro: `workout_sessions` → `workout_sets`.
- Modelo de historial de activaciones: `user_active_routine_log`.
- Consultas con JOINs para obtener una rutina completa con sus días y ejercicios en una sola petición (o mediante funciones RPC).
- Uso de Foreign Keys, Constraints, Partial Unique Indexes y Triggers para mantener la integridad referencial.
- Triggers necesarios:
    - Auto-creación de `profile` tras registro en `auth.users`.
    - Actualización atómica de `likes_count`.
    - Cierre de log de rutina activa al cambiar de rutina.

**Recursos clave:**

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- PostgreSQL JOINs, CTEs (Common Table Expressions), Triggers.

---

## 5. Supabase Storage

**Descripción:** Gestión de archivos estáticos, específicamente imágenes de ejercicios.

**Aplicación en el proyecto:**

- Crear un bucket `exercise-images`.
- Políticas: lectura pública, escritura solo para usuarios autenticados.
- Upload de imágenes desde el frontend (React island).
- Generación de URLs públicas para mostrar en la UI.
- Consideraciones: compresión de imágenes en el cliente antes del upload, límites de tamaño, validación de formato.

**Recursos clave:**

- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

## 6. React State Management (Formularios Dinámicos)

**Descripción:** Manejar estado complejo en el cliente, especialmente para formularios donde el número de campos es variable (registro de series de entrenamiento).

**Aplicación en el proyecto:**

- **Registro de entreno:** El usuario agrega series dinámicamente. Cada serie tiene 3 inputs: número de serie, reps, peso. Nota opcional por serie.
- **Guardado por batch:** Al finalizar un ejercicio, todas sus series se envían juntas vía API Route.
- **Edición de rutina:** Agregar/quitar ejercicios a un día, reordenar ejercicios.
- Posible uso de `useReducer` o una librería ligera como `zustand` para el estado global del entreno activo.

**Recursos clave:**

- [React useReducer Hook](https://react.dev/reference/react/useReducer)
- [Zustand (opcional)](https://github.com/pmndrs/zustand)

---

## 7. Tailwind CSS Custom Theme & Design Tokens

**Descripción:** Extender Tailwind con un sistema de diseño propio (colores, tipografías, spacing) de forma escalable.

**Aplicación en el proyecto:**

- Configurar `tailwind.config` con:
    - Paleta `primary`: 50-950 (base `#CCFF00`).
    - Paleta `secondary`: 50-950 (base `#c8c6c5`).
    - Paleta `background`: 50-950 (base `#131313`).
    - Familias tipográficas: `Space Grotesk`, `Inter`, `JetBrains Mono`.
    - Spacing custom (8px grid, gutters, móvil/desktop).
- Usar `@apply` o componentes reutilizables para botones, inputs, cards, chips.
- Implementar glass cards, glow effects y animaciones (`fade-in-up`) con Tailwind + CSS puro.

**Recursos clave:**

- [Tailwind Configuration](https://tailwindcss.com/docs/configuration)
- [Tailwind Custom Colors](https://tailwindcss.com/docs/customizing-colors)

---

## 8. Data Visualization (Gráficos de Progreso)

**Descripción:** Renderizar gráficos interactivos para visualizar la evolución del rendimiento en los ejercicios.

**Aplicación en el proyecto:**

- Gráfico de líneas/barras: peso máximo levantado en un ejercicio a lo largo del tiempo.
- Gráfico de líneas: volumen total (sets × reps × peso) por sesión.
- Debe ser responsive y funcionar bien en móvil (tooltip táctil).
- Las estadísticas se calculan vía queries agregadas a `workout_sets`; en el futuro se puede migrar a tablas de resumen si el volumen de datos lo requiere.
- Librerías sugeridas: **Recharts** (React-friendly) o **Tremor** (componentes con Tailwind).

**Recursos clave:**

- [Recharts Documentation](https://recharts.org/en-US)
- [Tremor Components](https://www.tremor.so/)

---

## 9. Mobile First Responsive Design

**Descripción:** Diseñar interfaces que funcionen primero en móvil y se adapten progresivamente a pantallas más grandes.

**Aplicación en el proyecto:**

- **Mobile First:** Los inputs de registro de entreno deben ser grandes y fáciles de tocar con una mano.
- Navegación inferior o superior compacta en móvil; sidebar o navegación expandida en desktop.
- Layouts con CSS Grid / Flexbox que se reconfiguren según el viewport.
- Considerar el teclado numérico en móviles para los inputs de peso/reps (`inputmode="numeric"`).

**Recursos clave:**

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Mobile First](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Responsive/Mobile_first)

---

## 10. Arquitectura de Backend en Capas

**Descripción:** Diseñar un backend desacoplado y portable usando API Routes de Astro, con separación clara entre transporte, lógica de negocio y acceso a datos.

**Aplicación en el proyecto:**

- **Capa de Transporte (Controllers):** Astro API Routes (`src/pages/api/`). Reciben requests HTTP, validan input, llaman a Services, devuelven responses. Sin lógica de negocio.
- **Capa de Lógica de Negocio (Services):** TypeScript en `src/lib/services/`. Reglas del dominio: cálculo de inasistencias, gestión de aprobaciones de ejercicios, validación de duplicados, control de rutinas activas, etc.
- **Capa de Acceso a Datos (Repositories):** TypeScript en `src/lib/repositories/`. Queries directas a Supabase/PostgreSQL. Abstraen el cliente de base de datos.
- **Modelos (DTOs):** TypeScript en `src/lib/models/`. Tipado fuerte de entidades y payloads.
- **Cliente React:** Se comunica exclusivamente con API Routes mediante `fetch`. No conecta directamente a Supabase para operaciones de escritura complejas.
- **Portabilidad:** Si se migra el backend a Express, Nest o Hono, solo se reescriben los Controllers (API Routes). Services y Repositories se migran tal cual.

**Recursos clave:**

- [Astro API Routes](https://docs.astro.build/en/guides/endpoints/)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 11. Cronómetro / Temporizador en Cliente

**Descripción:** Implementar un temporizador funcional en el navegador sin persistencia.

**Aplicación en el proyecto:**

- Componente React que maneja un intervalo (`setInterval`).
- Inputs para ajustar el tiempo base (+/- segundos).
- Estados: iniciar, pausar, resetear.
- Visualización clara (mm:ss) en tipografía monospaced.

**Recursos clave:**

- [React useEffect & Timers](https://react.dev/reference/react/useEffect)

---

## 12. Manipulación de Fechas y Rangos

**Descripción:** Trabajar con fechas para el historial de entrenos, agrupación por semanas, filtros y cálculo de inasistencias.

**Aplicación en el proyecto:**

- Guardar `session_date` en `workout_sessions` (fecha editable por el usuario).
- Filtros del historial: "Últimos 7 días", "Último mes", "Últimos 3 meses", "Todo el tiempo".
- Agrupación de registros para la vista semanal y mensual.
- Cálculo de inasistencias comparando `routine_days` programados contra `workout_sessions` existentes, usando `user_active_routine_log`.
- Librería sugerida: **date-fns** (ligera y modular) o **Day.js**.

**Recursos clave:**

- [date-fns Documentation](https://date-fns.org/)

---

## 13. Manejo de Imágenes y Assets

**Descripción:** Optimizar la carga de imágenes en una aplicación web moderna.

**Aplicación en el proyecto:**

- Imágenes de ejercicios subidas por usuarios (potencialmente pesadas).
- Imágenes de la landing (fotos de gimnasio).
- Uso del componente `<Image>` de Astro para optimización automática (formato WebP, lazy loading).
- Para imágenes dinámicas (ejercicios), considerar compresión previa al upload.

**Recursos clave:**

- [Astro Images](https://docs.astro.build/en/guides/images/)

---

_Documento actualizado para el proyecto IRON TRACK._
