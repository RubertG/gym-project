// @vitest-environment jsdom
/**
 * Tests unitarios para DashboardMobileNav.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockLogoutButton = vi.fn(() => <button type="button">Logout</button>)

vi.mock('@/components/features/auth/LogoutButton', () => ({
    LogoutButton: mockLogoutButton,
}))

const { DashboardMobileNav } = await import('./DashboardMobileNav')

describe('DashboardMobileNav', () => {
    it('renderiza el header con hamburguesa', () => {
        render(<DashboardMobileNav user={{ id: 'user-123' }} profile={null} />)

        expect(
            screen.getByRole('button', { name: /abrir menu/i })
        ).toBeTruthy()
        expect(
            screen.getByText((content) => content.includes('IRON'))
        ).toBeTruthy()
        expect(
            screen.getByText((content) => content.includes('TRACK'))
        ).toBeTruthy()
    })

    it('muestra links del dashboard y username en el overlay', async () => {
        const profile = {
            id: 'user-123',
            username: 'ironathlete',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        } as const

        render(
            <DashboardMobileNav user={{ id: 'user-123' }} profile={profile} />
        )

        const toggle = screen.getByRole('button', { name: /abrir menu/i })

        fireEvent.click(toggle)

        await waitFor(() => {
            expect(
                screen.getByRole('navigation', { name: /menu mobile/i })
            ).toBeTruthy()
        })

        expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy()
        expect(screen.getByRole('link', { name: /profile/i })).toBeTruthy()
        expect(screen.getByText('ironathlete')).toBeTruthy()
        expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy()
    })
})
