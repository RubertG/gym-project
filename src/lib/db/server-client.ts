/*
 * Cliente de Supabase para el servidor que lee cookies del request.
 * Usa @supabase/ssr para manejar correctamente las cookies de sesión en SSR.
 */

import { createServerClient } from '@supabase/ssr'
import { env } from '@/lib/config/env'
import type { APIContext } from 'astro'

/**
 * Crea un cliente de Supabase que lee las cookies del request.
 * Este cliente usa la anon_key y lee las cookies de sesión del navegador.
 */
export function createSupabaseServerClient(context: APIContext) {
    return createServerClient(
        env.PUBLIC_SUPABASE_URL,
        env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    // Astro no tiene getAll(), necesitamos parsear las cookies del header
                    const cookieHeader =
                        context.request.headers.get('cookie') || ''

                    return cookieHeader
                        .split(';')
                        .map((cookie) => {
                            const [name, ...valueParts] = cookie
                                .trim()
                                .split('=')

                            return { name, value: valueParts.join('=') }
                        })
                        .filter((cookie) => cookie.name)
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        context.cookies.set(name, value, options)
                    )
                },
            },
        }
    )
}
