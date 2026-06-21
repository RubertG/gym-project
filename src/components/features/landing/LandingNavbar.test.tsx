// @vitest-environment jsdom
/**
 * Tests unitarios para LandingNavbar.
 * Verifica estados de autenticacion y navegacion mobile.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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

    it('muestra el nombre del usuario y Dashboard cuando hay sesion', () => {
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
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy()
        expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy()
        expect(screen.queryByRole('link', { name: /login/i })).toBeNull()
    })

    it('abre y cierra el menu mobile al hacer click en el toggle', () => {
        render(<LandingNavbar user={null} profile={null} />)

        const toggle = screen.getByRole('button', {
            name: /abrir menu/i,
        })

        expect(toggle.getAttribute('aria-expanded')).toBe('false')

        fireEvent.click(toggle)

        const closeToggle = screen.getByRole('button', {
            name: /cerrar menu/i,
        })

        expect(closeToggle.getAttribute('aria-expanded')).toBe('true')
        expect(
            screen.getByRole('navigation', { name: /menu mobile/i })
        ).toBeTruthy()

        fireEvent.click(closeToggle)

        expect(
            screen
                .getByRole('button', { name: /abrir menu/i })
                .getAttribute('aria-expanded')
        ).toBe('false')
    })
})
