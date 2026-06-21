import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { envBrowser } from '@/lib/config/env-browser'

/**
 * Cliente de Supabase para el navegador.
 * Proporciona dos factories:
 * - getAnonClient(): cliente sin sesion (para operaciones publicas)
 * - getBrowserClient(): cliente con sesion persistente via cookies
 */

// Singleton lazy para el cliente anonimo
let _anonClient: SupabaseClient | null = null

// Singleton lazy para el cliente del navegador (con sesion)
let _browserClient: SupabaseClient | null = null

/**
 * Obtiene el cliente anonimo de Supabase (sin persistencia de sesion).
 * Lazy singleton: se crea una sola vez y se reutiliza.
 */
export function getAnonClient(): SupabaseClient {
    if (!_anonClient) {
        _anonClient = createClient(
            envBrowser.PUBLIC_SUPABASE_URL,
            envBrowser.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            }
        )
    }
    return _anonClient
}

/**
 * Extrae el project ref de la URL de Supabase.
 * Formato esperado: https://<project-ref>.supabase.co
 */
function getProjectRef(): string {
    const url = new URL(envBrowser.PUBLIC_SUPABASE_URL)
    const host = url.hostname // e.g. "abcdefghijk.supabase.co"

    return host.split('.')[0]
}

/**
 * Adapter de almacenamiento basado en cookies para la sesion de Supabase.
 * Las cookies permiten que el servidor lea la sesion del usuario.
 */
function createCookieStorageAdapter() {
    const projectRef = getProjectRef()
    const cookieName = `sb-${projectRef}-auth-token`

    return {
        /**
         * Lee el valor de la cookie de autenticacion.
         */
        getItem(name: string): string | null {
            const targetName = name || cookieName
            const cookies = document.cookie.split(';')

            for (const cookie of cookies) {
                const [key, ...valueParts] = cookie.trim().split('=')

                if (key === targetName) {
                    return decodeURIComponent(valueParts.join('='))
                }
            }
            return null
        },

        /**
         * Establece la cookie de autenticacion.
         */
        setItem(name: string, value: string): void {
            const targetName = name || cookieName
            // Cookie de sesion (sin max-age, expira al cerrar el navegador)
            // Path=/ para que este disponible en toda la aplicacion
            document.cookie = `${targetName}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
        },

        /**
         * Elimina la cookie de autenticacion.
         */
        removeItem(name: string): void {
            const targetName = name || cookieName
            document.cookie = `${targetName}=; path=/; max-age=0`
        },
    }
}

/**
 * Obtiene el cliente de Supabase con persistencia de sesion via cookies.
 * Lazy singleton: se crea una sola vez y se reutiliza.
 */
export function getBrowserClient(): SupabaseClient {
    if (!_browserClient) {
        const storageAdapter = createCookieStorageAdapter()

        _browserClient = createClient(
            envBrowser.PUBLIC_SUPABASE_URL,
            envBrowser.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    storage: storageAdapter,
                },
            }
        )
    }
    return _browserClient
}
