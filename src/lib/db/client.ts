import { createClient } from '@supabase/supabase-js';
import type { DbClient } from './types';
import { AppError } from '@/lib/utils/errors';

declare const process: { env: Record<string, string | undefined> };

let _serverClient: DbClient | null = null;

/**
 * Crea un cliente de Supabase a partir de variables de entorno.
 * Usa import.meta.env (Astro SSR) o process.env (scripts Node.js).
 */
export function createServerClient(): DbClient {
    const url = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
    const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new AppError(
            'Faltan las variables de entorno de Supabase (SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)',
            500,
        );
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }) as unknown as DbClient;
}

/**
 * Configura el cliente de servidor que usaran los repositories.
 * Util para inyeccion de mocks en tests.
 */
export function setServerClient(client: DbClient): void {
    _serverClient = client;
}

/**
 * Obtiene el cliente de base de datos del servidor.
 * Lazy singleton: crea el cliente automaticamente si no existe.
 */
export function getServerClient(): DbClient {
    if (!_serverClient) {
        _serverClient = createServerClient();
    }
    return _serverClient;
}
