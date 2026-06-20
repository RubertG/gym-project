/*
 * POST /api/auth/logout
 * Cierra la sesion del usuario y limpia todas las cookies de Supabase.
 * Es idempotente: si no hay sesion, igualmente retorna 200.
 */

export const prerender = false

import type { APIContext } from 'astro'
import * as authService from '@/lib/services/authService'

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
    try {
        // Intentar cerrar sesion en Supabase (best-effort)
        await authService.signOut()
    } catch {
        // Si falla el signOut, igualmente limpiamos las cookies localmente.
        // El signOut puede fallar si la sesion ya expiro, pero las cookies
        // deben limpiarse de todas formas.
    }

    // Limpiar todas las cookies de Supabase (sb-*)
    // Astro expone las cookies del request via context.cookies
    const allCookies = context.request.headers.get('cookie') ?? ''
    const cookieNames = allCookies
        .split(';')
        .map((c) => c.trim().split('=')[0])
        .filter((name) => name.startsWith('sb-'))

    for (const name of cookieNames) {
        context.cookies.delete(name, { path: '/' })
    }

    return jsonResponse({ success: true }, 200)
}
