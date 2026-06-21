// @vitest-environment jsdom
/**
 * Tests unitarios para LogoutButton.
 * Verifica: llama fetch con URL y method correctos.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LogoutButton } from './LogoutButton'

describe('LogoutButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true }),
        }) as ReturnType<typeof fetch>

        // Mock window.location.href
        delete (window as Record<string, unknown>).location
        window.location = { href: '', ...window.location } as Location
    })

    it('calls fetch with correct URL and method on click', async () => {
        render(<LogoutButton />)

        const button = screen.getByRole('button', { name: /cerrar sesion/i })

        fireEvent.click(button)

        // Esperar a que se resuelva la promesa del fetch
        await vi.waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith('/api/auth/logout', {
                method: 'POST',
            })
        })
    })

    it('redirects to /login after successful logout', async () => {
        render(<LogoutButton />)

        const button = screen.getByRole('button', { name: /cerrar sesion/i })

        fireEvent.click(button)

        await vi.waitFor(() => {
            expect(window.location.href).toBe('/login')
        })
    })

    it('redirects to /login even if fetch fails', async () => {
        globalThis.fetch = vi
            .fn()
            .mockRejectedValue(new Error('Network error')) as ReturnType<
            typeof fetch
        >

        render(<LogoutButton />)

        const button = screen.getByRole('button', { name: /cerrar sesion/i })

        fireEvent.click(button)

        await vi.waitFor(() => {
            expect(window.location.href).toBe('/login')
        })
    })
})
