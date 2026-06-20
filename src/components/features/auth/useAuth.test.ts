// @vitest-environment jsdom
/**
 * Tests unitarios para el hook useAuth.
 * Verifica: loading inicial, carga de sesion, signOut.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// ─── Mocks ───────────────────────────────────────────────────────────

const mockGetSession = vi.fn()

vi.mock('@/lib/db/browser-client', () => ({
    getBrowserClient: () => ({
        auth: {
            getSession: mockGetSession,
        },
    }),
}))

const { useAuth } = await import('./useAuth')

// ─── Tests ───────────────────────────────────────────────────────────

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns loading true on mount, then loads session data', async () => {
        const mockUser = { id: 'user-123', email: 'test@example.com' }
        const mockProfile = { id: 'user-123', username: 'testuser' }

        mockGetSession.mockResolvedValue({
            data: {
                session: { user: mockUser },
            },
        })

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ profile: mockProfile }),
        }) as ReturnType<typeof fetch>

        const { result } = renderHook(() => useAuth())

        // Estado inicial: loading = true
        expect(result.current.loading).toBe(true)
        expect(result.current.user).toBeNull()
        expect(result.current.profile).toBeNull()

        // Esperar a que la sesion se cargue
        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        // Verificar que los datos de sesion se cargaron
        expect(result.current.user).toEqual(mockUser)
        expect(result.current.profile).toEqual(mockProfile)

        // Verificar que getSession fue llamado
        expect(mockGetSession).toHaveBeenCalled()
    })

    it('sets loading false when no session exists', async () => {
        mockGetSession.mockResolvedValue({
            data: { session: null },
        })

        const { result } = renderHook(() => useAuth())

        // Estado inicial: loading = true
        expect(result.current.loading).toBe(true)

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        expect(result.current.user).toBeNull()
        expect(result.current.profile).toBeNull()
    })

    it('signOut calls POST /api/auth/logout and clears state', async () => {
        mockGetSession.mockResolvedValue({ data: { session: null } })

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        }) as ReturnType<typeof fetch>

        // Mock window.location
        const originalLocation = window.location

        delete (window as Record<string, unknown>).location
        window.location = { ...originalLocation, href: '' } as Location

        const { result } = renderHook(() => useAuth())

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        })

        await act(async () => {
            await result.current.signOut()
        })

        expect(globalThis.fetch).toHaveBeenCalledWith('/api/auth/logout', {
            method: 'POST',
        })
        expect(result.current.user).toBeNull()
        expect(result.current.profile).toBeNull()

        window.location = originalLocation
    })
})
