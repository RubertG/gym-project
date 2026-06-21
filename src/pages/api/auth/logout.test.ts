import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockContext } from '../__helpers__/mockContext'

// Mock de createSupabaseServerClient
const mockSignOut = vi.fn()
vi.mock('@/lib/db/server-client', () => ({
    createSupabaseServerClient: () => ({
        auth: {
            signOut: mockSignOut,
        },
    }),
}))

// Mock de env
vi.mock('@/lib/config/env', () => ({
    env: {
        PUBLIC_SUPABASE_URL: 'https://testproject.supabase.co',
        PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    },
}))

const { POST } = await import('./logout')

describe('POST /api/auth/logout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deberia retornar 200 en logout exitoso', async () => {
        mockSignOut.mockResolvedValue({ error: null })

        const ctx = createMockContext()

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
    })

    it('deberia retornar 200 incluso si signOut falla', async () => {
        mockSignOut.mockRejectedValue(new Error('Session expired'))

        const ctx = createMockContext()

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
    })

    it('deberia limpiar las cookies de Supabase', async () => {
        mockSignOut.mockResolvedValue({ error: null })

        const ctx = createMockContext()
        ctx.request.headers.set(
            'cookie',
            'sb-test-auth-token=abc; sb-test-auth-token-code=def; other=xyz'
        )

        await POST(ctx)

        expect(ctx.cookies.delete).toHaveBeenCalledWith('sb-test-auth-token', {
            path: '/',
        })
        expect(ctx.cookies.delete).toHaveBeenCalledWith(
            'sb-test-auth-token-code',
            { path: '/' }
        )
        expect(ctx.cookies.delete).not.toHaveBeenCalledWith(
            'other',
            expect.anything()
        )
    })
})
