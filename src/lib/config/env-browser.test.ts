import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests para src/lib/config/env-browser.ts
 * Verifica la validacion de variables de entorno para el browser.
 */

describe('env-browser', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('deberia exportar un objeto tipado cuando todas las vars estan presentes', async () => {
        vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
        vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key');

        const { envBrowser } = await import('./env-browser');

        expect(envBrowser).toEqual({
            SUPABASE_URL: 'https://test.supabase.co',
            SUPABASE_ANON_KEY: 'test-anon-key',
        });
    });

    it('deberia lanzar error con nombre de la clave cuando falta una var', async () => {
        vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
        vi.stubEnv('SUPABASE_ANON_KEY', '');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow('Missing environment variables: SUPABASE_ANON_KEY');
    });

    it('deberia listar todas las claves faltantes en el error', async () => {
        vi.stubEnv('SUPABASE_URL', '');
        vi.stubEnv('SUPABASE_ANON_KEY', '');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow(
            'Missing environment variables: SUPABASE_URL, SUPABASE_ANON_KEY'
        );
    });

    it('deberia lanzar error si SUPABASE_URL no es una URL valida', async () => {
        vi.stubEnv('SUPABASE_URL', 'not-a-url');
        vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow('Invalid environment variables: SUPABASE_URL');
    });
});
