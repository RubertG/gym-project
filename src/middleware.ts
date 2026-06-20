/*
 * Astro Middleware
 * Verifica sesion de Supabase, adjunta user/profile a context.locals
 * y protege rutas privadas.
 */

import { createSupabaseServerClient } from '@/lib/db/server-client'
import { defineMiddleware } from 'astro:middleware'
import type { Profile } from '@/lib/models'
import { findProfileByUserId } from '@/lib/repositories/profileRepository'
import { getServerClient } from '@/lib/db/client'

/* ─────────── Locals tipados ─────────── */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace App {
        interface Locals {
            user: { id: string } | null;
            profile: Profile | null;
        }
    }
}

/* ─────────── Configuracion ─────────── */

const PUBLIC_ROUTES: RegExp[] = [
    /^\/$/, // Landing
    /^\/login\/?$/, // Login
    /^\/register\/?$/, // Registro
    /^\/api\/(auth|health)\/?/i, // API publicas
    /^\/design-system(\/.*)?$/, // Design system (incluyendo subrutas)
    /^\/_astro\//, // Assets de Astro
    /^\/favicon\.ico$/, // Favicon
    /^\/public\//, // Archivos estaticos
]

function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((rx) => rx.test(pathname))
}

/* ─────────── Middleware de autenticacion ─────────── */

const authMiddleware = defineMiddleware(async (context, next) => {
    const { url, redirect } = context

    context.locals.user = null
    context.locals.profile = null

    const isPublic = isPublicRoute(url.pathname)

    try {
        // Usar cliente que lee cookies del request para verificar sesión
        const supabase = createSupabaseServerClient(context)
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
            context.locals.user = { id: session.user.id }
            // Usar service_role client para operaciones de base de datos
            const db = getServerClient()
            const profile = await findProfileByUserId(db, session.user.id)
            context.locals.profile = profile
        }
    } catch {
        // Error al obtener sesion: dejar user/profile como null
    }

    const hasSession = context.locals.user !== null

    if (!isPublic && !hasSession) {
        return redirect('/login')
    }

    return next()
})

/* ─────────── Exportar pipeline ─────────── */

export const onRequest = authMiddleware
