import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests para src/lib/config/env-browser.ts
 * Verifica la validacion de variables de entorno para el browser.
 */

describe('env-browser', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('deberia exportar un objeto tipado cuando todas las vars estan presentes', async () => {
        vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
        vi.stubEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-anon-key');

        const { envBrowser } = await import('./env-browser');

        expect(envBrowser).toEqual({
            PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
            PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
        });
    });

    it('deberia lanzar error con nombre de la clave cuando falta una var', async () => {
        vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
        vi.stubEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow(
            'Missing environment variables: PUBLIC_SUPABASE_PUBLISHABLE_KEY'
        );
    });

    it('deberia listar todas las claves faltantes en el error', async () => {
        vi.stubEnv('PUBLIC_SUPABASE_URL', '');
        vi.stubEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY', '');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow(
            'Missing environment variables: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY'
        );
    });

    it('deberia lanzar error si PUBLIC_SUPABASE_URL no es una URL valida', async () => {
        vi.stubEnv('PUBLIC_SUPABASE_URL', 'not-a-url');
        vi.stubEnv('PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-anon-key');

        await expect(async () => {
            await import('./env-browser');
        }).rejects.toThrow(
            'Invalid environment variables: PUBLIC_SUPABASE_URL'
        );
    });
});
