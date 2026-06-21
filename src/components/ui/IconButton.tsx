/**
 * IconButton — Botón de solo icono.
 * Envuelve Button con dimensiones fijas para toggles, cerrar, etc.
 */

import React from 'react'
import { Button, type ButtonProps } from './Button'

export interface IconButtonProps extends Omit<
    ButtonProps,
    'leftIcon' | 'rightIcon' | 'children' | 'href'
> {
    icon: React.ReactNode;
    'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            icon,
            variant = 'ghost-primary',
            size = 'sm',
            className = '',
            ...props
        },
        ref
    ) => {
        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={`h-11 w-11 p-0 ${className}`}
                {...props}
            >
                <span className="inline-flex items-center justify-center">
                    {icon}
                </span>
            </Button>
        )
    }
)

IconButton.displayName = 'IconButton'
export default IconButton
