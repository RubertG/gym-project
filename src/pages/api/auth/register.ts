/*
 * POST /api/auth/register
 * Registro de nuevos usuarios.
 * Valida body con Zod, delega a authService.signUp.
 */

export const prerender = false

import type { APIContext } from 'astro'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/db/server-client'
import { getServerClient } from '@/lib/db/client'
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
        // Usar cliente que maneja cookies del request
        const supabase = createSupabaseServerClient(context)

        const { data, error } = await supabase.auth.signUp({
            email: result.data.email,
            password: result.data.password,
        })

        if (error || !data.user) {
            if (error?.message.includes('already registered')) {
                return jsonResponse({ error: 'Email already registered' }, 409)
            }
            return jsonResponse(
                { error: error?.message || 'Registration failed' },
                400
            )
        }

        // Actualizar perfil del usuario (ya fue creado por trigger de Supabase)
        const db = getServerClient()
        const username =
            result.data.username || data.user.email?.split('@')[0] || 'user'

        // Intentar actualizar el perfil existente
        const { updateProfile } = await import('@/lib/services/profileService')

        try {
            const profile = await updateProfile(data.user.id, { username }, db)

            // Hacer login automáticamente después del registro para establecer sesión
            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: result.data.email,
                    password: result.data.password,
                })

            if (loginError) {
                // El registro fue exitoso pero el login falló, aún así retornar éxito
                // El usuario puede hacer login manualmente
            }

            return jsonResponse(
                {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                    },
                    profile: profile
                        ? {
                              id: profile.id,
                              username: profile.username,
                          }
                        : null,
                },
                201
            )
        } catch {
            const { createProfile } =
                await import('@/lib/services/profileService')
            const profile = await createProfile(
                {
                    userId: data.user.id,
                    username,
                },
                db
            )

            // Hacer login automáticamente
            await supabase.auth.signInWithPassword({
                email: result.data.email,
                password: result.data.password,
            })

            return jsonResponse(
                {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                    },
                    profile: profile
                        ? {
                              id: profile.id,
                              username: profile.username,
                          }
                        : null,
                },
                201
            )
        }
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
