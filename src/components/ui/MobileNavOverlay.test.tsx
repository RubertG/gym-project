// @vitest-environment jsdom
/**
 * Tests unitarios para MobileNavOverlay.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileNavOverlay } from './MobileNavOverlay'

describe('MobileNavOverlay', () => {
    it('no renderiza nada cuando isOpen es false', () => {
        render(
            <MobileNavOverlay
                isOpen={false}
                onClose={vi.fn()}
                links={[{ label: 'Inicio', href: '/' }]}
            />
        )

        expect(
            screen.queryByRole('navigation', { name: /menu mobile/i })
        ).toBeNull()
    })

    it('renderiza links y footer cuando isOpen es true', () => {
        render(
            <MobileNavOverlay
                isOpen={true}
                onClose={vi.fn()}
                links={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                ]}
                footer={<span data-testid="footer">Footer content</span>}
            />
        )

        expect(
            screen.getByRole('navigation', { name: /menu mobile/i })
        ).toBeTruthy()
        expect(screen.getByRole('link', { name: /inicio/i })).toBeTruthy()
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy()
        expect(screen.getByTestId('footer')).toBeTruthy()
    })

    it('llama onClose al hacer click en el boton de cerrar', async () => {
        const onClose = vi.fn()

        render(
            <MobileNavOverlay
                isOpen={true}
                onClose={onClose}
                links={[{ label: 'Inicio', href: '/' }]}
            />
        )

        const closeButton = screen.getByRole('button', {
            name: /cerrar panel de navegacion/i,
        })

        fireEvent.click(closeButton)

        await waitFor(() => {
            expect(onClose).toHaveBeenCalled()
        })
    })
})
