import { z } from 'zod'

/**
 * Configuracion de variables de entorno.
 * Lee de import.meta.env (Astro SSR) con fallback a process.env (scripts Node.js).
 * Valida con Zod en tiempo de carga del modulo (eager).
 */

declare const process: { env: Record<string, string | undefined> }

// Lectura segura: import.meta.env con fallback a process.env
function getEnvVar(key: string): string | undefined {
    try {
        const metaVal = (
            import.meta as unknown as Record<
                string,
                Record<string, string | undefined>
            >
        ).env?.[key]

        if (metaVal) return metaVal
    } catch {
        // import.meta.env no disponible en algunos contextos
    }
    return process.env[key]
}

// Claves requeridas
const REQUIRED_KEYS = [
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
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
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
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
export const env = parsed.data

export type Env = z.infer<typeof envSchema>
