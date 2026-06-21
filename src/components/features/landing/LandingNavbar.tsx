/**
 * LandingNavbar — Navegación mobile-first para la landing page.
 * Usa MobileNavOverlay para el menu mobile futurista.
 */

import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import type { Profile } from '@/lib/models'
import { LogoutButton } from '@/components/features/auth/LogoutButton'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { MobileNavOverlay } from '@/components/ui/MobileNavOverlay'
import { NavLink } from '@/components/ui/NavLink'

interface LandingNavbarProps {
    user: { id: string } | null;
    profile: Profile | null;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
    user,
    profile,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const displayName = profile?.username ?? 'Usuario'

    const toggleMenu = () => setIsOpen((prev) => !prev)
    const closeMenu = () => setIsOpen(false)

    const mainLinks = user
        ? [
              { label: 'Inicio', href: '/' },
              { label: 'Design System', href: '/design-system' },
              { label: 'Componentes', href: '/design-system/components' },
              { label: 'Dashboard', href: '/dashboard' },
          ]
        : [
              { label: 'Inicio', href: '/' },
              { label: 'Design System', href: '/design-system' },
              { label: 'Componentes', href: '/design-system/components' },
          ]

    const footer = user ? (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <span className="text-primary-300 font-mono text-sm font-bold tracking-wide uppercase">
                    {displayName}
                </span>
            </div>
            <LogoutButton hideLabelOnMobile={false} />
        </div>
    ) : (
        <div className="flex flex-col gap-3">
            <Button
                href="/login"
                variant="ghost"
                className="w-full justify-center"
                onClick={closeMenu}
            >
                Login
            </Button>
            <Button
                href="/register"
                variant="primary"
                className="w-full justify-center"
                onClick={closeMenu}
            >
                Sign Up
            </Button>
        </div>
    )

    return (
        <>
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
                {/* Left: logo */}
                <div className="flex flex-1 basis-0 items-center justify-start">
                    <a
                        href="/"
                        className="font-display text-xl font-bold tracking-tight transition-colors"
                        aria-label="IRON TRACK Inicio"
                    >
                        <span className="text-primary-300">IRON</span>{' '}
                        <span className="text-word-100">TRACK</span>
                    </a>
                </div>

                {/* Center: desktop navigation */}
                <nav className="hidden flex-1 basis-0 items-center justify-center gap-1 md:flex">
                    {mainLinks.map((link) => (
                        <NavLink key={link.href} href={link.href}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right: auth actions */}
                <div className="hidden flex-1 basis-0 items-center justify-end gap-3 md:flex">
                    {user ? (
                        <>
                            <span className="text-word-400 font-mono text-xs tracking-wide uppercase">
                                <span className="text-primary-300">
                                    {displayName}
                                </span>
                            </span>
                            <LogoutButton hideLabelOnMobile={false} />
                        </>
                    ) : (
                        <>
                            <Button href="/login" variant="ghost">
                                Login
                            </Button>
                            <Button href="/register" variant="primary">
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <div className="flex flex-1 basis-0 items-center justify-end md:hidden">
                    <IconButton
                        icon={<Menu className="h-6 w-6" aria-hidden="true" />}
                        onClick={toggleMenu}
                        aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
                        aria-expanded={isOpen}
                        aria-controls="landing-mobile-overlay"
                    />
                </div>
            </div>

            <MobileNavOverlay
                isOpen={isOpen}
                onClose={closeMenu}
                links={mainLinks}
                footer={footer}
                brandHref="/"
                id="landing-mobile-overlay"
            />
        </>
    )
}

export default LandingNavbar
