/*
 * POST /api/auth/login
 * Inicio de sesion con email y password.
 * Valida body con Zod, delega a authService.signIn, establece cookies de sesion.
 */

export const prerender = false

import type { APIContext } from 'astro'
import { z } from 'zod'
import * as profileService from '@/lib/services/profileService'
import { AppError } from '@/lib/utils/errors'
import { createSupabaseServerClient } from '@/lib/db/server-client'

// Esquema de validacion para login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

/**
 * Helper para respuestas JSON.
 */
function jsonResponse(data: unknown, status: number): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function POST(context: APIContext): Promise<Response> {
    let body: unknown

    try {
        body = await context.request.json()
    } catch {
        return jsonResponse({ error: 'Invalid request body' }, 400)
    }

    const result = loginSchema.safeParse(body)

    if (!result.success) {
        return jsonResponse({ error: 'Invalid email or password' }, 401)
    }

    try {
        // Usar cliente que maneja cookies del request
        const supabase = createSupabaseServerClient(context)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: result.data.email,
            password: result.data.password,
        })

        if (error || !data.session) {
            return jsonResponse({ error: 'Invalid email or password' }, 401)
        }

        // Obtener perfil del usuario
        const { getServerClient } = await import('@/lib/db/client')
        const db = getServerClient()
        const profile = await profileService.getProfile(data.user.id, db)

        return jsonResponse(
            {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                },
                profile,
            },
            200
        )
    } catch (err) {
        if (err instanceof AppError && err.isOperational) {
            // Credenciales invalidas → 401
            return jsonResponse({ error: 'Invalid email or password' }, 401)
        }

        return jsonResponse({ error: 'Internal server error' }, 500)
    }
}
