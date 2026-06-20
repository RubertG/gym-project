---
name: astro-api-routes
description: >-
    Generate Astro API Routes following IRON TRACK's strict layered architecture.
    Use this skill whenever creating, modifying, or reviewing REST endpoints in src/pages/api/.
    Ensures Controller → Service → Repository flow, proper input validation, error handling
    with custom classes, and correct HTTP status codes. NO Server Actions allowed.
---

# Astro API Routes — IRON TRACK

Skill para generar endpoints REST en Astro siguiendo la arquitectura en capas estricta del proyecto IRON TRACK.

## 1. Arquitectura Obligatoria

Todo endpoint REST DEBE seguir este flujo:

```
HTTP Request
    │
    ▼
Controller (src/pages/api/**/*.ts)
    │  - Parsea y valida input
    │  - Extrae cookies/headers (auth)
    │  - Llama al Service
    │  - Devuelve JSON con status code
    │
    ▼
Service (src/lib/services/*.ts)
    │  - Lógica de negocio
    │  - Reglas de dominio
    │  - Orquestación
    │  - Llama a Repository
    │
    ▼
Repository (src/lib/repositories/*.ts)
    │  - Queries a Supabase
    │  - Retorna datos tipados
    │
    ▼
Supabase PostgreSQL
```

### Reglas de Capas

| Capa           | Ubicación               | Responsabilidad                                             | NO PUEDE                                                     |
| -------------- | ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| **Controller** | `src/pages/api/`        | Parsear HTTP, validar input, llamar Service, responder JSON | Contener lógica de negocio, llamar Repository directamente   |
| **Service**    | `src/lib/services/`     | Lógica de negocio, reglas, validaciones complejas           | Importar `supabase` directamente, acceder a request/response |
| **Repository** | `src/lib/repositories/` | Queries a BD, mapeo de datos                                | Contener lógica de negocio, conocer HTTP                     |

## 2. Estructura de un Endpoint

### GET — Listar/Obtener recursos

```typescript
// src/pages/api/exercises/index.ts
import type { APIRoute } from 'astro';
import { getApprovedExercises } from '@/lib/services/exerciseService';
import { AppError } from '@/lib/utils/errors';

export const GET: APIRoute = async ({ request, cookies }) => {
    try {
        // 1. Extraer auth (si es necesario)
        const session = cookies.get('sb-session');

        // 2. Parsear query params
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') ?? '1');
        const limit = Number(url.searchParams.get('limit') ?? '20');

        // 3. Llamar al Service
        const result = await getApprovedExercises({ page, limit });

        // 4. Responder con JSON
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
};
```

### POST — Crear recurso

```typescript
// src/pages/api/routines/index.ts
import type { APIRoute } from 'astro';
import { createRoutine } from '@/lib/services/routineService';
import { ValidationError, AuthError } from '@/lib/utils/errors';
import { handleError } from '@/lib/utils/api-errors';
import { CreateRoutinePayload } from '@/lib/models';

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        // 1. Verificar autenticación
        const userId = cookies.get('sb-user-id')?.value;
        if (!userId) {
            throw new AuthError('Usuario no autenticado');
        }

        // 2. Parsear y validar body
        const body = await request.json();
        const payload: CreateRoutinePayload = validateRoutineInput(body);

        // 3. Llamar al Service
        const routine = await createRoutine(userId, payload);

        // 4. Responder 201 Created
        return new Response(JSON.stringify(routine), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
};

function validateRoutineInput(body: unknown): CreateRoutinePayload {
    if (!body || typeof body !== 'object') {
        throw new ValidationError('Body inválido');
    }

    const { name, isPublic } = body as Record<string, unknown>;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('El nombre de la rutina es obligatorio');
    }

    if (name.length > 100) {
        throw new ValidationError('El nombre no puede exceder 100 caracteres');
    }

    return {
        name: name.trim(),
        isPublic: typeof isPublic === 'boolean' ? isPublic : false,
    };
}
```

### PUT/PATCH — Actualizar recurso

```typescript
// src/pages/api/routines/[id].ts
import type { APIRoute } from 'astro';
import { updateRoutine } from '@/lib/services/routineService';
import { ValidationError, AuthError, NotFoundError } from '@/lib/utils/errors';
import { handleError } from '@/lib/utils/api-errors';

export const PUT: APIRoute = async ({ params, request, cookies }) => {
    try {
        const userId = cookies.get('sb-user-id')?.value;
        if (!userId) {
            throw new AuthError('Usuario no autenticado');
        }

        const routineId = params.id;
        if (!routineId) {
            throw new ValidationError('ID de rutina requerido');
        }

        const body = await request.json();
        const updated = await updateRoutine(userId, routineId, body);

        return new Response(JSON.stringify(updated), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
};
```

### DELETE — Eliminar recurso (soft delete)

```typescript
// src/pages/api/routines/[id].ts
export const DELETE: APIRoute = async ({ params, cookies }) => {
    try {
        const userId = cookies.get('sb-user-id')?.value;
        if (!userId) {
            throw new AuthError('Usuario no autenticado');
        }

        const routineId = params.id;
        await deleteRoutine(userId, routineId);

        return new Response(null, { status: 204 });
    } catch (error) {
        return handleError(error);
    }
};
```

## 3. Manejo de Errores Centralizado

Crear `src/lib/utils/api-errors.ts`:

```typescript
import { AppError, ValidationError, AuthError, NotFoundError } from './errors';

export function handleError(error: unknown): Response {
    // Errores custom del dominio
    if (error instanceof ValidationError) {
        return new Response(
            JSON.stringify({ error: error.message, details: error.details }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (error instanceof AuthError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (error instanceof NotFoundError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (error instanceof AppError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: error.statusCode ?? 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Errores inesperados
    console.error('Unexpected error in API route:', error);
    return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
}
```

## 4. Clases de Error Custom

En `src/lib/utils/errors.ts`:

```typescript
export class AppError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
    details?: Record<string, string[]>;

    constructor(message: string, details?: Record<string, string[]>) {
        super(message, 400);
        this.name = 'ValidationError';
        this.details = details;
    }
}

export class AuthError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'AuthError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}
```

## 5. Convenciones de Nomenclatura

| Elemento              | Convención                     | Ejemplo                          |
| --------------------- | ------------------------------ | -------------------------------- |
| Archivo de endpoint   | kebab-case o index.ts          | `src/pages/api/routines/[id].ts` |
| Función handler       | camelCase + método HTTP        | `GET`, `POST`, `PUT`, `DELETE`   |
| Función de validación | `validate` + Entidad + `Input` | `validateRoutineInput`           |
| Payload DTO           | PascalCase + `Payload`         | `CreateRoutinePayload`           |

## 6. Estructura de Carpetas para APIs

```
src/pages/api/
├── auth/
│   ├── login.ts
│   ├── register.ts
│   └── logout.ts
├── exercises/
│   ├── index.ts          # GET (list), POST (create)
│   └── [id].ts           # GET (one), PUT, DELETE
├── routines/
│   ├── index.ts          # GET (list), POST (create)
│   ├── [id].ts           # GET (one), PUT, DELETE
│   └── [id]/
│       ├── activate.ts   # POST
│       └── days.ts       # GET, POST
├── workouts/
│   ├── index.ts
│   ├── [id].ts
│   └── [id]/
│       └── sets.ts       # POST (batch)
└── profile/
    └── index.ts          # GET, PUT
```

## 7. NO Server Actions — Regla Absoluta

**PROHIBIDO:**

- ❌ `formAction` en componentes
- ❌ `Astro.serverActions`
- ❌ Mutaciones desde componentes Astro sin pasar por API
- ❌ Llamar Services directamente desde componentes cliente

**CORRECTO:**

- ✅ Toda mutación pasa por `src/pages/api/*`
- ✅ Componentes cliente usan `fetch()` para llamar endpoints
- ✅ Server Islands SOLO para lectura/presentación

## 8. Pre-flight Check para Endpoints

Antes de entregar cualquier API Route, verificar:

- [ ] **¿El endpoint sigue Controller → Service → Repository?**
- [ ] **¿Hay validación de input en el Controller?**
- [ ] **¿Se usan las clases de error custom?** (`ValidationError`, `AuthError`, etc.)
- [ ] **¿Los status codes son correctos?** (200, 201, 204, 400, 401, 403, 404, 500)
- [ ] **¿La autenticación se verifica antes de la lógica de negocio?**
- [ ] **¿No hay lógica de negocio en el Controller?**
- [ ] **¿No hay llamadas directas a Supabase desde el Controller?**
- [ ] **¿Los tipos están explícitos?** (TypeScript strict)

## 9. Ejemplo Completo: CRUD de Rutinas

### Controller: `src/pages/api/routines/index.ts`

```typescript
import type { APIRoute } from 'astro';
import { getUserRoutines, createRoutine } from '@/lib/services/routineService';
import { ValidationError, AuthError } from '@/lib/utils/errors';
import { handleError } from '@/lib/utils/api-errors';
import type { CreateRoutinePayload } from '@/lib/models';

export const GET: APIRoute = async ({ cookies }) => {
    try {
        const userId = cookies.get('sb-user-id')?.value;
        if (!userId) throw new AuthError('No autenticado');

        const routines = await getUserRoutines(userId);
        return new Response(JSON.stringify(routines), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const userId = cookies.get('sb-user-id')?.value;
        if (!userId) throw new AuthError('No autenticado');

        const body = await request.json();
        const payload = validateCreateRoutine(body);
        const routine = await createRoutine(userId, payload);

        return new Response(JSON.stringify(routine), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
};

function validateCreateRoutine(body: unknown): CreateRoutinePayload {
    if (!body || typeof body !== 'object') {
        throw new ValidationError('Body inválido');
    }

    const { name, isPublic } = body as Record<string, unknown>;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('Nombre de rutina requerido');
    }

    return {
        name: name.trim(),
        isPublic: typeof isPublic === 'boolean' ? isPublic : false,
    };
}
```

### Service: `src/lib/services/routineService.ts`

```typescript
import { routineRepository } from '@/lib/repositories/routineRepository';
import {
    ValidationError,
    NotFoundError,
    ForbiddenError,
} from '@/lib/utils/errors';
import type { Routine, CreateRoutinePayload } from '@/lib/models';

export async function getUserRoutines(userId: string): Promise<Routine[]> {
    return routineRepository.findByUserId(userId);
}

export async function createRoutine(
    userId: string,
    payload: CreateRoutinePayload
): Promise<Routine> {
    // Regla de negocio: máximo 10 rutinas activas por usuario
    const activeRoutines = await routineRepository.findActiveByUserId(userId);
    if (activeRoutines.length >= 10) {
        throw new ValidationError('Máximo de 10 rutinas activas alcanzado');
    }

    return routineRepository.create(userId, payload);
}

export async function deleteRoutine(
    userId: string,
    routineId: string
): Promise<void> {
    const routine = await routineRepository.findById(routineId);

    if (!routine) {
        throw new NotFoundError('Rutina no encontrada');
    }

    if (routine.userId !== userId) {
        throw new ForbiddenError('No tienes permiso para eliminar esta rutina');
    }

    // Soft delete
    await routineRepository.softDelete(routineId);
}
```

### Repository: `src/lib/repositories/routineRepository.ts`

```typescript
import { supabase } from '@/lib/db/supabase';
import type { Routine, CreateRoutinePayload } from '@/lib/models';

export const routineRepository = {
    async findByUserId(userId: string): Promise<Routine[]> {
        const { data, error } = await supabase
            .from('routines')
            .select('*')
            .eq('user_id', userId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data ?? [];
    },

    async findActiveByUserId(userId: string): Promise<Routine[]> {
        const { data, error } = await supabase
            .from('routines')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .is('deleted_at', null);

        if (error) throw error;
        return data ?? [];
    },

    async findById(id: string): Promise<Routine | null> {
        const { data, error } = await supabase
            .from('routines')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        return data;
    },

    async create(
        userId: string,
        payload: CreateRoutinePayload
    ): Promise<Routine> {
        const { data, error } = await supabase
            .from('routines')
            .insert({ ...payload, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async softDelete(id: string): Promise<void> {
        const { error } = await supabase
            .from('routines')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};
```

## 10. Clean Code y SOLID

### Principios aplicados:

- **Single Responsibility**: Cada función hace UNA cosa (validar, orquestar, persistir)
- **Open/Closed**: Services pueden extenderse sin modificar el Controller
- **Dependency Inversion**: Controller depende de abstracciones (Services), no implementaciones
- **Separation of Concerns**: HTTP en Controller, negocio en Service, datos en Repository

### Reglas de Clean Code:

- ✅ Funciones pequeñas (< 20 líneas idealmente)
- ✅ Nombres descriptivos y consistentes
- ✅ Un nivel de abstracción por función
- ✅ Early return para validaciones
- ✅ Sin comentarios obvios (el código debe ser autoexplicativo)
- ✅ DRY: extraer lógica repetida a funciones helper
