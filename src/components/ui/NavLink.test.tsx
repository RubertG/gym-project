// @vitest-environment jsdom
/**
 * Tests unitarios para NavLink.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavLink } from './NavLink'

describe('NavLink', () => {
    it('renderiza el enlace con su label', () => {
        render(<NavLink href="/dashboard">Dashboard</NavLink>)

        const link = screen.getByRole('link', { name: /dashboard/i })
        expect(link).toBeTruthy()
        expect(link.getAttribute('href')).toBe('/dashboard')
    })

    it('marca como activo cuando active es true', () => {
        render(
            <NavLink href="/dashboard" active>
                Dashboard
            </NavLink>
        )

        const link = screen.getByRole('link', { name: /dashboard/i })
        expect(link.className).toContain('text-primary-300')
    })

    it('aplica className adicional', () => {
        render(
            <NavLink href="/dashboard" className="extra-class">
                Dashboard
            </NavLink>
        )

        const link = screen.getByRole('link', { name: /dashboard/i })
        expect(link.className).toContain('extra-class')
    })
})
