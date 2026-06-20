/*
 * POST /api/auth/register
 * Registro de nuevos usuarios.
 * Valida body con Zod, delega a authService.signUp.
 */

export const prerender = false

import type { APIContext } from 'astro'
import { z } from 'zod'
import * as authService from '@/lib/services/authService'
import { AppError } from '@/lib/utils/errors'

// Esquema de validacion para registro
const registerSchema = z.object({
    email: z.string().email().max(255),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username must contain only letters, numbers and underscores'
        )
        .optional(),
})

/**
 * Helper para respuestas JSON con status code.
 */
function jsonResponse(data: unknown, status: number): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

/**
 * Convierte un Zod error en un array de mensajes de detalle.
 */
function zodIssuesToDetails(
    error: z.ZodError
): { field: string; message: string }[] {
    return error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }))
}

export async function POST(context: APIContext): Promise<Response> {
    let body: unknown

    try {
        body = await context.request.json()
    } catch {
        return jsonResponse(
            {
                error: 'Validation failed',
                details: [{ field: 'body', message: 'Invalid JSON' }],
            },
            400
        )
    }

    const result = registerSchema.safeParse(body)

    if (!result.success) {
        return jsonResponse(
            {
                error: 'Validation failed',
                details: zodIssuesToDetails(result.error),
            },
            400
        )
    }

    try {
        const signUpResult = await authService.signUp(result.data)

        return jsonResponse(
            {
                user: {
                    id: signUpResult.user.id,
                    email: signUpResult.user.email,
                },
                profile: signUpResult.profile
                    ? {
                          id: signUpResult.profile.id,
                          username: signUpResult.profile.username,
                      }
                    : null,
            },
            201
        )
    } catch (err) {
        if (err instanceof AppError) {
            // Email duplicado → 409
            if (
                err.statusCode === 409 ||
                err.message.includes('already registered')
            ) {
                return jsonResponse({ error: 'Email already registered' }, 409)
            }

            // Otros errores operacionales (validacion del servicio, etc.)
            if (err.isOperational) {
                return jsonResponse({ error: err.message }, err.statusCode)
            }
        }

        return jsonResponse({ error: 'Internal server error' }, 500)
    }
}
