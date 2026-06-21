/**
 * NavLink — Enlace de navegación con animación de underline.
 * Estilo link, no botón. Sin scale.
 */

import React from 'react'

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    className?: string;
}

export const NavLink: React.FC<NavLinkProps> = ({
    href,
    children,
    active = false,
    className = '',
}) => {
    const textClasses = active
        ? 'text-primary-300'
        : 'text-word-300 hover:text-primary-300'

    return (
        <a
            href={href}
            className={`group relative inline-flex min-h-[44px] items-center px-3 py-2 text-sm font-bold tracking-wide whitespace-nowrap uppercase transition-colors duration-200 ${textClasses} ${className}`}
        >
            {children}
            <span
                className={`bg-primary-400 absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
                aria-hidden="true"
            />
        </a>
    )
}

NavLink.displayName = 'NavLink'
export default NavLink
