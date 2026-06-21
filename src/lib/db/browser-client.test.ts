import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Tests para src/lib/db/browser-client.ts
 * Mockeamos createClient de @supabase/supabase-js y el modulo env.
 */

// Mock de @supabase/supabase-js
const mockCreateClient = vi.fn()
vi.mock('@supabase/supabase-js', () => ({
    createClient: mockCreateClient,
}))

// Mock del modulo env-browser
vi.mock('@/lib/config/env-browser', () => ({
    envBrowser: {
        PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
        PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
    },
}))

// Mock de document.cookie para tests de navegador

describe('browser-client', () => {
    beforeEach(() => {
        vi.resetModules()
        mockCreateClient.mockReset()
        mockCreateClient.mockReturnValue({ mock: 'supabase-client' })

        // Simular document.cookie
        Object.defineProperty(globalThis, 'document', {
            value: {
                cookie: '',
            },
            writable: true,
            configurable: true,
        })
    })

    it('deberia crear el cliente anonimo con la URL y clave correctas', async () => {
        const { getAnonClient } = await import('./browser-client')

        getAnonClient()

        expect(mockCreateClient).toHaveBeenCalledWith(
            'https://test-project.supabase.co',
            'test-anon-key',
            expect.objectContaining({
                auth: expect.objectContaining({
                    persistSession: false,
                    autoRefreshToken: false,
                }),
            })
        )
    })

    it('deberia retornar el mismo cliente anonimo (singleton)', async () => {
        const { getAnonClient } = await import('./browser-client')

        const client1 = getAnonClient()
        const client2 = getAnonClient()

        expect(client1).toBe(client2)
        // createClient solo se llama una vez
        expect(mockCreateClient).toHaveBeenCalledTimes(1)
    })

    it('deberia crear el cliente del navegador con storage adapter de cookies', async () => {
        const { getBrowserClient } = await import('./browser-client')

        getBrowserClient()

        expect(mockCreateClient).toHaveBeenCalledWith(
            'https://test-project.supabase.co',
            'test-anon-key',
            expect.objectContaining({
                auth: expect.objectContaining({
                    persistSession: true,
                    autoRefreshToken: true,
                    storage: expect.objectContaining({
                        getItem: expect.any(Function),
                        setItem: expect.any(Function),
                        removeItem: expect.any(Function),
                    }),
                }),
            })
        )
    })
})
