# Astro API Routes — Code Examples

Referencia de patrones de código para endpoints REST en IRON TRACK.

---

## 1. Helper de Errores Centralizado

### `src/lib/utils/api-errors.ts`

```typescript
import {
    AppError,
    ValidationError,
    AuthError,
    NotFoundError,
    ForbiddenError,
} from './errors';

export function handleError(error: unknown): Response {
    if (error instanceof ValidationError) {
        return new Response(
            JSON.stringify({ error: error.message, details: error.details }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    if (error instanceof AuthError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (error instanceof ForbiddenError) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 403,
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

    console.error('Unexpected error in API route:', error);
    return new Response(
        JSON.stringify({ error: 'Error interno del servidor' }),
        {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
```

---

## 2. Clases de Error Custom

### `src/lib/utils/errors.ts`

```typescript
export class AppError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ValidationError extends AppError {
    details?: Record<string, string[]>;

    constructor(message: string, details?: Record<string, string[]>) {
        super(message, 400);
        this.name = 'ValidationError';
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class AuthError extends AppError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'AuthError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
```

---

## 3. Patrón de Validación

### Validación con early return

```typescript
import { ValidationError } from '@/lib/utils/errors';

function validateExerciseInput(body: unknown): CreateExercisePayload {
    if (!body || typeof body !== 'object') {
        throw new ValidationError('Request body is required');
    }

    const data = body as Record<string, unknown>;
    const errors: Record<string, string[]> = {};

    // Name validation
    const name = data.name;
    if (!name || typeof name !== 'string') {
        errors.name = ['Name is required'];
    } else if (name.trim().length < 3) {
        errors.name = ['Name must be at least 3 characters'];
    } else if (name.length > 100) {
        errors.name = ['Name must not exceed 100 characters'];
    }

    // Category validation
    const validCategories = [
        'chest',
        'back',
        'legs',
        'shoulders',
        'arms',
        'core',
        'cardio',
    ];
    const category = data.category;
    if (!category || !validCategories.includes(category as string)) {
        errors.category = [`Must be one of: ${validCategories.join(', ')}`];
    }

    // Muscle group validation
    const muscleGroup = data.muscleGroup;
    if (!muscleGroup || typeof muscleGroup !== 'string') {
        errors.muscleGroup = ['Muscle group is required'];
    }

    if (Object.keys(errors).length > 0) {
        throw new ValidationError('Validation failed', errors);
    }

    return {
        name: (name as string).trim(),
        category: category as ExerciseCategory,
        muscleGroup: muscleGroup as string,
        description:
            typeof data.description === 'string' ? data.description : undefined,
        imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    };
}
```

---

## 4. Patrón de Autenticación

### Extraer usuario de cookies de Supabase

```typescript
import type { APIContext } from 'astro';
import { AuthError } from '@/lib/utils/errors';
import { supabase } from '@/lib/db/supabase';

export async function requireAuth(context: APIContext): Promise<string> {
    const { cookies } = context;

    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) {
        throw new AuthError('No session token provided');
    }

    // Verify token with Supabase
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
        throw new AuthError('Invalid or expired session');
    }

    return user.id;
}

export async function getOptionalAuth(
    context: APIContext
): Promise<string | null> {
    const { cookies } = context;

    const accessToken = cookies.get('sb-access-token')?.value;
    if (!accessToken) return null;

    const {
        data: { user },
    } = await supabase.auth.getUser(accessToken);

    return user?.id ?? null;
}
```

---

## 5. Patrón de Respuesta JSON

### Helper para respuestas consistentes

```typescript
export function jsonResponse<T>(data: T, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
    });
}

export function createdResponse<T>(data: T): Response {
    return jsonResponse(data, 201);
}

export function noContentResponse(): Response {
    return new Response(null, { status: 204 });
}

// Usage in controller:
export const GET: APIRoute = async ({ cookies }) => {
    try {
        const userId = await requireAuth({ cookies } as any);
        const data = await someService.getData(userId);
        return jsonResponse(data);
    } catch (error) {
        return handleError(error);
    }
};
```

---

## 6. Patrón de Paginación

### Query params con defaults

```typescript
import type { APIRoute } from 'astro';

interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

function parsePagination(url: URL): PaginationParams {
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit = Math.min(
        100,
        Math.max(1, Number(url.searchParams.get('limit') ?? '20'))
    );
    const offset = (page - 1) * limit;

    return { page, limit, offset };
}

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const { page, limit, offset } = parsePagination(url);

        const { data, total } = await someService.getPaginated(offset, limit);

        return jsonResponse({
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleError(error);
    }
};
```

---

## 7. Estructura de Carpetas Completa

```
src/pages/api/
├── auth/
│   ├── login.ts           → POST /api/auth/login
│   ├── register.ts        → POST /api/auth/register
│   ├── logout.ts          → POST /api/auth/logout
│   └── me.ts              → GET /api/auth/me
├── exercises/
│   ├── index.ts           → GET /api/exercises, POST /api/exercises
│   ├── [id].ts            → GET /api/exercises/:id, PUT, DELETE
│   └── [id]/
│       └── approve.ts     → POST /api/exercises/:id/approve (admin)
├── routines/
│   ├── index.ts           → GET /api/routines, POST /api/routines
│   ├── [id].ts            → GET /api/routines/:id, PUT, DELETE
│   └── [id]/
│       ├── activate.ts    → POST /api/routines/:id/activate
│       ├── days.ts        → GET, POST /api/routines/:id/days
│       └── clone.ts       → POST /api/routines/:id/clone
├── workouts/
│   ├── index.ts           → GET /api/workouts, POST /api/workouts
│   ├── [id].ts            → GET, PUT, DELETE /api/workouts/:id
│   └── [id]/
│       ├── sets.ts        → POST /api/workouts/:id/sets (batch)
│       └── complete.ts    → POST /api/workouts/:id/complete
├── community/
│   ├── routines.ts        → GET /api/community/routines (public)
│   └── routines/
│       └── [id]/
│           └── like.ts    → POST, DELETE /api/community/routines/:id/like
└── profile/
    └── index.ts           → GET, PUT /api/profile
```

---

## 8. Anti-patrones (NO HACER)

### ❌ Lógica de negocio en Controller

```typescript
// WRONG — Controller con lógica de negocio
export const POST: APIRoute = async ({ request, cookies }) => {
    const userId = cookies.get('sb-user-id')?.value;
    const body = await request.json();

    // ❌ NO: Lógica de negocio en el controller
    const existingRoutines = await supabase
        .from('routines')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true);

    if (existingRoutines.data?.length >= 10) {
        return new Response(JSON.stringify({ error: 'Max routines reached' }), {
            status: 400,
        });
    }

    const { data } = await supabase.from('routines').insert(body).select();
    return new Response(JSON.stringify(data), { status: 201 });
};
```

### ❌ Server Actions

```typescript
// WRONG — Server Action (PROHIBIDO)
<form action={handleSubmit}>
  <button type="submit">Save</button>
</form>

// CORRECTO — Fetch a API Route
const handleSubmit = async () => {
  const res = await fetch('/api/routines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const result = await res.json();
};
```

### ❌ Repository directo desde Controller

```typescript
// WRONG — Controller llama Repository directamente
export const GET: APIRoute = async () => {
    const data = await routineRepository.findAll(); // ❌ NO
    return jsonResponse(data);
};

// CORRECTO — Controller → Service → Repository
export const GET: APIRoute = async () => {
    const data = await routineService.getAllRoutines(); // ✅
    return jsonResponse(data);
};
```
