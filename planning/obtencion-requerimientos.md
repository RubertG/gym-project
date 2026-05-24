# Obtención de Requerimientos — IRON TRACK

> **Estado:** Consolidado v2.0 | **Fase:** Base para Arquitectura y Desarrollo por Módulos

---

## 1. Visión General

Aplicación web para seguimiento de entrenamiento en gimnasio, con enfoque en la gestión de rutinas semanales, registro preciso de progreso por ejercicio, control de asistencias y una comunidad donde los usuarios puedan compartir y copiar rutinas.

**Objetivo:** Construcción de la aplicación completa, no un MVP mutilado. Escalable y mantenable desde el diseño inicial.

**Stack tecnológico:** Astro (framework principal) + React (interactividad) + Tailwind CSS + Supabase (Auth, PostgreSQL, Storage).

**Arquitectura de backend:** API Routes de Astro con capas de Servicios y Repositorios. Server Islands de Astro exclusivamente para presentación/lectura estática.

---

## 2. Requerimientos Funcionales

### RF-01 — Biblioteca de Ejercicios Compartida

- La aplicación incluirá un **set inicial de ejercicios preestablecidos** (seed data) para que los usuarios no partan de cero.
- Los usuarios autenticados pueden proponer nuevos ejercicios con **nombre** e **imagen**.
- Todo ejercicio nuevo pasa a estado **`pending`** hasta ser aprobado por un administrador.
- Una vez aprobado (`status: 'approved'`), queda disponible en la **biblioteca global**.
- Al agregar un ejercicio a una rutina, la app sugiere coincidencias por nombre (case-insensitive) antes de permitir la creación.
- No hay duplicados de nombre en la biblioteca.
- _(Futuro)_ Los ejercicios aprobados podrán recibir likes de usuarios autenticados.

### RF-02 — Gestión de Rutinas (Estructura Semanal)

- Una **Rutina** es una plantilla configurable por el usuario.
- El **calendario natural tiene 7 días** (Lunes a Domingo), pero la rutina solo existirá en los días que el usuario configure.
- Cada día configurado puede tener:
  - Un **nombre personalizado** asignado por el usuario (ej: "Día de Pierna", "Push", "Pull").
  - Una lista ordenada de ejercicios (con series sugeridas, reps sugeridas, notas).
- Los días sin ejercicios se consideran **descanso**.
- El usuario puede tener **múltiples rutinas**.
- El usuario tiene **una Rutina Activa** a la vez.
- Si una rutina tiene sesiones de entreno registradas, **no se podrá editar directamente**; solo se podrá duplicar para crear una versión editable.
- **Likes:** Las rutinas públicas pueden recibir likes, pero **únicamente por usuarios autenticados**.

### RF-03 — Feed Comunitario

- Los usuarios pueden **publicar** una de sus rutinas (`is_public = true`), haciéndola visible para todos.
- Otros usuarios autenticados pueden dar **Like** a las rutinas públicas.
- Otros usuarios pueden **Copiar** una rutina pública a su perfil (recibe una copia editable propia).
- Las valoraciones por estrellas quedan **pendientes para una fase futura**.

### RF-04 — Registro de Entrenamiento (Batch por Ejercicio)

- El usuario abre su **Rutina Activa**, selecciona el **día de entreno** (puede ser un día pasado o de la semana actual) y comienza a registrar.
- El sistema crea un `workout_session` en estado **`draft`** para esa fecha.
- La fecha del entreno (`session_date`) es editable por el usuario al crear la sesión (permite registro retroactivo).
- **Guardado por ejercicio completado (batch):** Cuando el usuario finaliza un ejercicio, se envían **todas sus series de golpe** en una sola petición.
- Cada serie tiene inputs estructurados:
  - Número de serie.
  - Repeticiones realizadas.
  - Peso efectivo utilizado (kg).
  - **Nota opcional por serie**.
- Un mismo ejercicio **no se repite dos veces en el mismo día**. Varias tandas se registran como series adicionales.
- **Nota opcional** por sesión de entrenamiento (texto libre).
- Al finalizar todos los ejercicios del día, el usuario marca la sesión como **`completed`**. Una vez completada, la sesión ya no es editable.

### RF-05 — Temporizador de Descanso

- Temporizador simple, **local** (no se guarda en base de datos).
- El usuario introduce un tiempo base y puede **sumar o restar** segundos manualmente.
- Objetivo: llevar la cuenta del descanso entre series durante el entreno.
- **Versión avanzada con persistencia queda para una fase futura**.

### RF-06 — Historial de Progreso

- El historial es **por ejercicio**, global para el usuario. **No depende de la rutina**.
- El usuario puede ver:
  - **Vista Gráfica**: evolución del peso y/o repeticiones en el tiempo.
  - **Vista Log/Detalle**: registro detallado por día y sesión (series, reps, peso, notas).
- Filtros por rango de fechas y por ejercicio.
- Métricas calculadas sobre `workout_sets`: peso máximo, volumen total (sets × reps × peso), PRs automáticos.

### RF-07 — Calendario de Asistencias

- El usuario dispone de una **vista calendario** para visualizar sus días de entreno.
- El calendario consulta el historial de rutinas activas (`user_active_routine_log`) para saber qué rutina debía seguirse cada día.
- Comparando los días programados de la rutina activa histórica contra las `workout_sessions` existentes, el sistema identifica:
  - **Días completados** (sesión registrada).
  - **Inasistencias** (día programado con ejercicios, pero sin sesión).
  - **Descanso** (día programado sin ejercicios).
- El usuario puede clicar cualquier día del calendario para:
  - Ver la sesión existente.
  - Editar una sesión en estado `draft`.
  - Crear una sesión retroactiva.

### RF-08 — Autenticación y Roles

- Sistema de **registro e inicio de sesión** vía Supabase Auth.
- Los usuarios deben estar autenticados para acceder al Dashboard, dar likes y crear contenido.
- Los usuarios anónimos solo pueden ver la Landing Page y el feed público de rutinas (sin interactuar).
- **Roles preparados en el sistema**: `user` y `admin`.
- El rol `admin` puede aprobar ejercicios propuestos (`pending` → `approved`).
- El dueño del proyecto administra roles manualmente desde Supabase; no hay panel administrativo por ahora.

### RF-09 — Landing Page

- Página **pública** (sin autenticación).
- Muestra de qué trata la aplicación, sus funcionalidades y propuesta de valor.
- Incluye **imágenes reales de gimnasio** para generar emoción.
- Botones claros de Login y Registro.

---

## 3. Flujos de Usuario Principales

### Flujo 1: Crear y Seguir una Rutina

```
Registro/Login → Dashboard → Crear Nueva Rutina → Asignar ejercicios a días de la semana
→ Nombrar cada día configurado → Guardar → Activar Rutina
```

### Flujo 2: Entrenar (Día Actual o Retroactivo)

```
Abrir App → Ver Rutina Activa / Calendario → Seleccionar Día (hoy o pasado)
→ Registrar ejercicio por ejercicio (batch de series: reps/peso/notas)
→ Usar Temporizador entre series → Guardar ejercicio → Añadir Nota de sesión (opcional)
→ Finalizar Sesión (completada)
```

### Flujo 3: Explorar y Copiar

```
Dashboard → Comunidad → Ver Rutinas Públicas → Dar Like → Copiar Rutina a mi perfil
→ (Opcional) Editarla
```

### Flujo 4: Revisar Progreso y Calendario

```
Dashboard → Calendario / Historial → Seleccionar Ejercicio o Día
→ Ver Gráfica / Ver Log / Ver Inasistencias → Analizar progreso
```

---

## 4. Modelo de Datos Preliminar

> **Nota:** Schema consolidado tras el análisis de requerimientos. Sujeto a ajustes menores durante el diseño de BD.

### Entidades Principales

#### `users`

- Manejada por **Supabase Auth** (`auth.users`).
- Tabla complementaria `public.profiles` para datos adicionales (nombre de usuario, avatar, rol, soft delete).
- Trigger: al crear un usuario en `auth.users`, se crea automáticamente un `profile`.

#### `exercises` (Biblioteca Global)

| Campo      | Tipo                 | Notas                                                     |
| ---------- | -------------------- | --------------------------------------------------------- |
| id         | UUID (PK)            |                                                           |
| name       | VARCHAR              | Único, case-insensitive (índice funcional `LOWER(name)`). |
| image_url  | VARCHAR              | URL de Supabase Storage.                                  |
| created_by | UUID (FK → profiles) | Usuario que lo propuso.                                   |
| status     | VARCHAR              | `'pending' \| 'approved'`. Default: `'pending'`.          |
| created_at | TIMESTAMP            |                                                           |
| deleted_at | TIMESTAMP            | Soft delete.                                              |

#### `routines`

| Campo       | Tipo                 | Notas                                               |
| ----------- | -------------------- | --------------------------------------------------- |
| id          | UUID (PK)            |                                                     |
| user_id     | UUID (FK → profiles) | Dueño de la rutina.                                 |
| name        | VARCHAR              | Ej. "Volumen Upper/Lower"                           |
| is_active   | BOOLEAN              | Solo una `true` por usuario (partial unique index). |
| is_public   | BOOLEAN              | Visible en el feed comunitario.                     |
| likes_count | INTEGER              | Denormalizado. Actualizado vía trigger PostgreSQL.  |
| created_at  | TIMESTAMP            |                                                     |
| updated_at  | TIMESTAMP            |                                                     |
| deleted_at  | TIMESTAMP            | Soft delete.                                        |

#### `routine_days`

| Campo       | Tipo                 | Notas                                                     |
| ----------- | -------------------- | --------------------------------------------------------- |
| id          | UUID (PK)            |                                                           |
| routine_id  | UUID (FK → routines) |                                                           |
| day_of_week | INTEGER              | 0=Lunes, 6=Domingo.                                       |
| day_name    | VARCHAR              | Nombre personalizado por el usuario. Ej: "Día de Pierna". |
| order_index | INTEGER              | Para ordenar días.                                        |

#### `routine_exercises`

| Campo          | Tipo                     | Notas                                       |
| -------------- | ------------------------ | ------------------------------------------- |
| id             | UUID (PK)                |                                             |
| routine_day_id | UUID (FK → routine_days) |                                             |
| exercise_id    | UUID (FK → exercises)    | Solo ejercicios `approved`.                 |
| order_index    | INTEGER                  | Orden dentro del día.                       |
| suggested_sets | INTEGER                  | Series sugeridas (opcional).                |
| suggested_reps | VARCHAR                  | Reps sugeridas, ej. "8-12" (opcional).      |
| notes          | TEXT                     | Notas del ejercicio en este día (opcional). |

#### `user_active_routine_log`

| Campo          | Tipo                 | Notas                                                |
| -------------- | -------------------- | ---------------------------------------------------- |
| id             | UUID (PK)            |                                                      |
| user_id        | UUID (FK → profiles) |                                                      |
| routine_id     | UUID (FK → routines) | Rutina que estaba activa.                            |
| activated_at   | TIMESTAMP            | Cuándo se activó.                                    |
| deactivated_at | TIMESTAMP            | Cuándo dejó de ser la activa (NULL si es la actual). |

#### `workout_sessions`

| Campo          | Tipo                               | Notas                                                            |
| -------------- | ---------------------------------- | ---------------------------------------------------------------- |
| id             | UUID (PK)                          |                                                                  |
| user_id        | UUID (FK → profiles)               |                                                                  |
| routine_id     | UUID (FK → routines, nullable)     | Contexto: rutina seguida (puede ser NULL si se borró la rutina). |
| routine_day_id | UUID (FK → routine_days, nullable) | Contexto: día específico de la rutina.                           |
| session_date   | DATE                               | Fecha del entreno (editable por usuario).                        |
| completed_at   | TIMESTAMP                          | Momento real de finalización.                                    |
| note           | TEXT                               | Nota general de la sesión (opcional).                            |
| status         | VARCHAR                            | `'draft' \| 'completed'`.                                        |
| created_at     | TIMESTAMP                          |                                                                  |
| deleted_at     | TIMESTAMP                          | Soft delete.                                                     |

#### `workout_sets`

| Campo              | Tipo                         | Notas                                     |
| ------------------ | ---------------------------- | ----------------------------------------- |
| id                 | UUID (PK)                    |                                           |
| workout_session_id | UUID (FK → workout_sessions) |                                           |
| exercise_id        | UUID (FK → exercises)        | Referencia directa para historial global. |
| set_number         | INTEGER                      | Número de serie (1, 2, 3...).             |
| reps               | INTEGER                      | Repeticiones realizadas.                  |
| weight_kg          | DECIMAL                      | Peso utilizado en kg.                     |
| note               | TEXT                         | Nota opcional por serie.                  |
| created_at         | TIMESTAMP                    |                                           |

#### `routine_likes`

| Campo          | Tipo                        | Notas                       |
| -------------- | --------------------------- | --------------------------- |
| id             | UUID (PK)                   |                             |
| routine_id     | UUID (FK → routines)        |                             |
| user_id        | UUID (FK → profiles)        |                             |
| created_at     | TIMESTAMP                   |                             |
| **Constraint** | UNIQUE(routine_id, user_id) | Un like por usuario/rutina. |

---

## 5. Requerimientos de UI/UX y Diseño

### Sistema de Diseño: Voltage Industrial

- **Estilo:** Fusión de Industrial Brutalism + Cyber-Minimalism.
- **Fondo:** Oscuro absoluto (`#131313`), no hay modo claro. Dark Mode only.
- **Acento Primario:** Verde eléctrico / Lime (`#CCFF00`). Usado en botones primarios, estados activos, bordes de foco y glow effects.
- **Superficies:** Niveles de gris oscuro (`#1f1f1f`, `#2a2a2a`, `#353535`) para crear profundidad sin sombras.
- **Formas:** **0px border-radius** en todos los componentes. Cuadrados agresivos, bordes gruesos.
- **Efectos:** Glass cards con borde sutil verde (`rgba(204,255,0,0.2)`), glow en elementos primarios (`box-shadow: 0 0 25px rgba(204,255,0,0.3)`), animaciones de entrada (`fade-in-up`).

### Tipografía

| Uso               | Fuente            | Notas                                          |
| ----------------- | ----------------- | ---------------------------------------------- |
| Headlines/Display | `Space Grotesk`   | Pesados (700), tight letter-spacing            |
| Body              | `Inter` / `Geist` | Legible, limpio                                |
| Labels/Data/Mono  | `JetBrains Mono`  | Uppercase para labels, monospaced para números |

### Tokens de Color Tailwind (Escalables)

- `primary`: Escala 50-950 (base: `#CCFF00` / `#abd600`).
- `secondary`: Escala 50-950 (base: grises cálidos / `#c8c6c5`).
- `background`: Escala 50-950 (base: `#131313` / `#000000`).
- Objetivo: que un cambio de marca en el futuro sea trivial modificando solo los valores base del `tailwind.config`.

### Responsive

- **Mobile First:** El uso principal será en móvil (registro en el gym).
- Debe verse perfecto y usable en **PC y laptop**.
- Inputs táctiles grandes, fáciles de usar con una mano.

---

## 6. Requerimientos No Funcionales

| ID     | Requerimiento                                                                                                                                                            | Prioridad |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| RNF-01 | **Performance:** La app debe cargar rápido en móviles (3G/4G). Astro ayuda con esto (poco JS en la landing).                                                             | Alta      |
| RNF-02 | **Responsive:** Mobile First, adaptable a desktop.                                                                                                                       | Alta      |
| RNF-03 | **Accesibilidad:** Contraste alto (el diseño ya lo favorece), etiquetas ARIA en formularios, navegación por teclado en desktop.                                          | Media     |
| RNF-04 | **Escalabilidad:** El modelo de datos debe permitir crecimiento de usuarios sin rediseño radical.                                                                        | Alta      |
| RNF-05 | **Seguridad:** Uso de RLS (Row Level Security) en Supabase para que los usuarios solo vean/modifiquen sus propios datos (excepto la biblioteca de ejercicios aprobados). | Alta      |
| RNF-06 | **Mantenibilidad:** Arquitectura en capas (API Routes → Services → Repositories) para facilitar cambios de tecnología backend en el futuro.                              | Alta      |
| RNF-07 | **Integridad de datos:** Soft deletes, constraints de unicidad, foreign keys y triggers para evitar inconsistencias (ej: una sola rutina activa por usuario).            | Alta      |

---

## 7. Arquitectura de Backend

> **Principio:** Preparar la aplicación para un posible cambio de tecnología backend en el futuro, manteniendo el código desacoplado y siguiendo SOLID.

### Capas de Responsabilidad

| Capa                         | Tecnología                                        | Responsabilidad                                                                                     |
| ---------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Transporte / Controllers** | Astro API Routes (`src/pages/api/`)               | Recibir requests HTTP, validar input, llamar a Services, devolver responses. Sin lógica de negocio. |
| **Lógica de Negocio**        | TypeScript Services (`src/lib/services/`)         | Reglas del dominio: validar duplicados, calcular inasistencias, gestionar aprobaciones, etc.        |
| **Acceso a Datos**           | TypeScript Repositories (`src/lib/repositories/`) | Queries directas a Supabase/PostgreSQL. Abstracción del cliente de BD.                              |
| **Modelos**                  | TypeScript Interfaces/DTOs (`src/lib/models/`)    | Tipado fuerte de entidades y payloads.                                                              |

### Server Islands vs API Routes

- **Server Islands:** Se utilizan exclusivamente para **presentación y lectura** (renderizado de HTML en el servidor). Ejemplos: Landing Page, secciones estáticas del feed, stats resumidos. **No realizan mutaciones ni conectan directamente a Supabase para escritura.**
- **API Routes:** Único canal para **todas las operaciones de escritura, edición y lógica de negocio**. Cliente (React islands) → API Route → Service → Repository → Supabase.
- **No se utilizarán Server Actions** de Astro para evitar acoplamiento al framework.

### Autenticación en API Routes

- Las API Routes verifican el token de sesión (cookie o header) usando Supabase Auth.
- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor (API Routes/Services). Nunca en el cliente.

---

## 8. Futuro / Pendientes

Estas funcionalidades están identificadas y la base de datos está preparada para ellas, pero se desarrollarán en módulos posteriores:

- **Valoraciones por estrellas** en rutinas públicas (actualmente solo likes).
- **Temporizador avanzado:** Persistencia de tiempos de descanso, estadísticas de descanso.
- **Panel administrativo:** Gestión de ejercicios `pending`, moderación de contenido.
- **Notificaciones push:** Recordatorios de entreno.
- **Integraciones:** Exportar datos (CSV), integración con wearables.
- **Likes en ejercicios:** Cuando la biblioteca evolucione a publicaciones individuales.
- **Sistema de Streaks:** Rachas de asistencia consecutivas.
- **Predicción de recuperación:** Basada en historial de inasistencias y cargas.

---

## 9. Notas de Implementación Técnica

- **Astro Islands:** Landing estática con Server Islands. Dashboard con React islands para interactividad.
- **Supabase Auth:** Manejar sesiones tanto en server (Astro middleware/API Routes) como en client (React).
- **Supabase Storage:** Bucket para imágenes de ejercicios. Políticas públicas de lectura, escritura solo para usuarios autenticados.
- **RLS:** Crítico en `routines`, `workout_sessions`, `workout_sets`, `profiles`, `user_active_routine_log`. La tabla `exercises` (approved) es de lectura pública; escritura solo autenticados con restricciones de propiedad/admin.
- **Triggers PostgreSQL:**
  - Auto-creación de `profile` tras registro en `auth.users`.
  - Actualización atómica de `routines.likes_count` al insertar/borrar en `routine_likes`.
  - Cierre de `user_active_routine_log` anterior al activar una nueva rutina.
- **Índices clave:**
  - `LOWER(name)` único en `exercises`.
  - Partial unique index en `routines(user_id, is_active) WHERE is_active = true`.

---

_Documento consolidado para el proyecto IRON TRACK._
