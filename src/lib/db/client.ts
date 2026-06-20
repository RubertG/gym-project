import { createClient } from '@supabase/supabase-js';
import type { DbClient } from './types';
import { env } from '@/lib/config/env';

let _serverClient: DbClient | null = null;

/**
 * Crea un cliente de Supabase para el servidor usando las variables
 * de entorno ya validadas por el modulo env.
 */
export function createServerClient(): DbClient {
    return createClient(
        env.PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    ) as unknown as DbClient;
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
