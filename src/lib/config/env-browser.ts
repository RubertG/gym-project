import { z } from 'zod'

/**
 * Configuracion de variables de entorno para el BROWSER.
 * Solo contiene variables PUBLICAS (no secretos de servidor).
 * Lee de import.meta.env (Astro client-side).
 * Valida con Zod en tiempo de carga del modulo (eager).
 *
 * IMPORTANTE: Este archivo es seguro para el browser.
 * NO contiene SUPABASE_SERVICE_ROLE_KEY ni otros secretos.
 */

// Lectura segura desde import.meta.env (disponible en Astro client-side)
function getEnvVar(key: string): string | undefined {
    try {
        const meta = import.meta.env as Record<string, string | undefined>

        return meta[key]
    } catch {
        return undefined
    }
}

// Claves requeridas (solo publicas)
const REQUIRED_KEYS = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_PUBLISHABLE_KEY',
] as const

// Recopilar valores crudos
const raw: Record<string, string | undefined> = {}
const missingKeys: string[] = []

for (const key of REQUIRED_KEYS) {
    const value = getEnvVar(key)

    raw[key] = value

    if (!value || value.length < 1) {
        missingKeys.push(key)
    }
}

// Lanzar error con lista de claves faltantes
if (missingKeys.length > 0) {
    throw new Error(`Missing environment variables: ${missingKeys.join(', ')}`)
}

// Esquema Zod para validacion de formato
const envSchema = z.object({
    PUBLIC_SUPABASE_URL: z.url(),
    PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

// Validar formato (la URL debe ser valida)
const parsed = envSchema.safeParse(raw)

if (!parsed.success) {
    const issues = parsed.error.issues
    const invalidKeys = issues.map(
        (issue) => issue.path.join('.') || issue.path[0]
    )

    throw new Error(`Invalid environment variables: ${invalidKeys.join(', ')}`)
}

// Exportar objeto tipado y validado
export const envBrowser = parsed.data

export type EnvBrowser = z.infer<typeof envSchema>
