// @vitest-environment jsdom
/**
 * Tests unitarios para IconButton.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IconButton } from './IconButton'
import { Menu } from 'lucide-react'

describe('IconButton', () => {
    it('renderiza el icono y el aria-label', () => {
        render(
            <IconButton
                icon={<Menu data-testid="menu-icon" />}
                aria-label="Abrir menu"
            />
        )

        const button = screen.getByRole('button', { name: /abrir menu/i })
        expect(button).toBeTruthy()
        expect(screen.getByTestId('menu-icon')).toBeTruthy()
    })

    it('llama onClick al hacer click', () => {
        const handleClick = vi.fn()

        render(
            <IconButton
                icon={<Menu />}
                aria-label="Cerrar"
                onClick={handleClick}
            />
        )

        fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))
        expect(handleClick).toHaveBeenCalledOnce()
    })

    it('esta deshabilitado cuando disabled es true', () => {
        render(<IconButton icon={<Menu />} aria-label="Cerrar" disabled />)

        const button = screen.getByRole('button', { name: /cerrar/i })
        expect(button).toBeTruthy()
        expect((button as HTMLButtonElement).disabled).toBe(true)
    })
})
