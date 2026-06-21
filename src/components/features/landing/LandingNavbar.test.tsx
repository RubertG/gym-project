// @vitest-environment jsdom
/**
 * Tests unitarios para LandingNavbar.
 * Verifica estados de autenticacion, estructura desktop y overlay mobile.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockLogoutButton = vi.fn(() => <button type="button">Logout</button>)

vi.mock('@/components/features/auth/LogoutButton', () => ({
    LogoutButton: mockLogoutButton,
}))

const { LandingNavbar } = await import('./LandingNavbar')

describe('LandingNavbar', () => {
    it('muestra Login y Sign Up cuando no hay sesion', () => {
        render(<LandingNavbar user={null} profile={null} />)

        expect(screen.getByRole('link', { name: /login/i })).toBeTruthy()
        expect(screen.getByRole('link', { name: /sign up/i })).toBeTruthy()
        expect(screen.queryByText(/conectado como/i)).toBeNull()
    })

    it('muestra el nombre del usuario junto al logout cuando hay sesion', () => {
        const profile = {
            id: 'user-123',
            username: 'ironathlete',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        } as const

        render(<LandingNavbar user={{ id: 'user-123' }} profile={profile} />)

        expect(screen.getByText(/conectado como/i)).toBeTruthy()
        expect(screen.getByText('ironathlete')).toBeTruthy()
        expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy()
        expect(screen.queryByRole('link', { name: /login/i })).toBeNull()
    })

    it('incluye Dashboard en los links principales cuando hay sesion', () => {
        render(<LandingNavbar user={{ id: 'user-123' }} profile={null} />)

        expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy()
    })

    it('abre y cierra el overlay mobile al hacer click en el toggle', async () => {
        render(<LandingNavbar user={null} profile={null} />)

        const toggle = screen.getByRole('button', {
            name: /abrir menu/i,
        })

        expect(toggle.getAttribute('aria-expanded')).toBe('false')
        expect(document.getElementById('landing-mobile-overlay')).toBeNull()

        fireEvent.click(toggle)

        await waitFor(() => {
            expect(
                document.getElementById('landing-mobile-overlay')
            ).toBeTruthy()
        })

        const headerToggle = screen.getByRole('button', {
            name: /cerrar menu/i,
        })

        expect(headerToggle.getAttribute('aria-expanded')).toBe('true')

        const overlayClose = screen.getByRole('button', {
            name: /cerrar panel de navegacion/i,
        })

        fireEvent.click(overlayClose)

        await waitFor(() => {
            expect(
                document.getElementById('landing-mobile-overlay')
            ).toBeNull()
        })
    })
})
