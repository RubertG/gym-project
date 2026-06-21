// @vitest-environment jsdom
/**
 * Tests unitarios para el hook useAuth.
 * Verifica: loading inicial, carga de sesion, signOut.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

// ─── Mocks ───────────────────────────────────────────────────────────

const mockGetUser = vi.fn()

vi.mock('@/lib/db/browser-client', () => ({
    getBrowserClient: () => ({
        auth: {
            getUser: mockGetUser,
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

        mockGetUser.mockResolvedValue({
            data: {
                user: mockUser,
            },
            error: null,
        })

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ profile: mockProfile }),
            })
        )

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

        // Verificar que getUser fue llamado
        expect(mockGetUser).toHaveBeenCalled()
    })

    it('sets loading false when no session exists', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: null },
            error: null,
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
        mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({}),
            })
        )

        // Mock window.location
        const originalLocation = window.location

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { ...originalLocation, href: '' },
        })

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

        Object.defineProperty(window, 'location', {
            writable: true,
            value: originalLocation,
        })
    })
})
