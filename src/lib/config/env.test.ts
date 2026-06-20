import { describe, it, expect, beforeEach, vi } from 'vitest';

declare const process: { env: Record<string, string | undefined> };

/**
 * Tests para src/lib/config/env.ts
 * Dado que el modulo valida en tiempo de carga (eager),
 * usamos vi.resetModules() + import() dinamico para controlar las vars.
 */

const VALID_URL = 'https://test-project.supabase.co';
const VALID_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.anon-key';
const VALID_SERVICE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role-key';

describe('env config', () => {
    beforeEach(() => {
        vi.resetModules();
        // Limpiar process.env
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_ANON_KEY;
        delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('deberia exportar env valido cuando todas las variables estan presentes', async () => {
        process.env.SUPABASE_URL = VALID_URL;
        process.env.SUPABASE_ANON_KEY = VALID_ANON_KEY;
        process.env.SUPABASE_SERVICE_ROLE_KEY = VALID_SERVICE_KEY;

        const { env } = await import('./env');

        expect(env.SUPABASE_URL).toBe(VALID_URL);
        expect(env.SUPABASE_ANON_KEY).toBe(VALID_ANON_KEY);
        expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(VALID_SERVICE_KEY);
    });

    it('deberia lanzar error con la clave faltante cuando falta una variable', async () => {
        process.env.SUPABASE_URL = VALID_URL;
        process.env.SUPABASE_ANON_KEY = VALID_ANON_KEY;
        // SUPABASE_SERVICE_ROLE_KEY falta

        await expect(() => import('./env')).rejects.toThrow(
            'Missing environment variables: SUPABASE_SERVICE_ROLE_KEY'
        );
    });

    it('deberia lanzar error con todas las claves faltantes cuando faltan varias', async () => {
        // Todas faltan
        await expect(() => import('./env')).rejects.toThrow(
            'Missing environment variables: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY'
        );
    });

    it('deberia lanzar error cuando la URL no es valida', async () => {
        process.env.SUPABASE_URL = 'not-a-valid-url';
        process.env.SUPABASE_ANON_KEY = VALID_ANON_KEY;
        process.env.SUPABASE_SERVICE_ROLE_KEY = VALID_SERVICE_KEY;

        await expect(() => import('./env')).rejects.toThrow(
            'Invalid environment variables'
        );
    });
});
