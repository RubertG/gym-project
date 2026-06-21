/**
 * LandingNavbar — Navegación mobile-first para la landing page.
 * Detecta sesión del usuario y muestra Login/Sign Up o Dashboard/Logout.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import type { Profile } from '@/lib/models'
import { LogoutButton } from '@/components/features/auth/LogoutButton'
import { Button } from '@/components/ui/Button'

interface LandingNavbarProps {
    user: { id: string } | null;
    profile: Profile | null;
}

const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Design System', href: '/design-system' },
    { label: 'Componentes', href: '/design-system/components' },
]

const menuVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
    user,
    profile,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const displayName = profile?.username ?? 'Usuario'

    const toggleMenu = () => setIsOpen((prev) => !prev)
    const closeMenu = () => setIsOpen(false)

    return (
        <header className="bg-background-900/95 border-secondary-800/30 sticky top-0 z-50 border-b backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <a
                    href="/"
                    className="font-display text-xl font-bold tracking-tight transition-colors"
                    aria-label="IRON TRACK Inicio"
                >
                    <span className="text-primary-300">IRON</span>{' '}
                    <span className="text-word-100">TRACK</span>
                </a>

                {/* Desktop navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex min-h-[44px] items-center border-2 border-transparent px-3 py-2 text-sm font-bold tracking-wide uppercase transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop auth actions */}
                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <>
                            <span className="text-word-400 font-mono text-xs tracking-wide uppercase">
                                Conectado como{' '}
                                <span className="text-primary-300">
                                    {displayName}
                                </span>
                            </span>
                            <Button
                                href="/dashboard"
                                variant="ghost"
                                size="sm"
                                leftIcon={
                                    <LayoutDashboard className="h-4 w-4" />
                                }
                            >
                                Dashboard
                            </Button>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Button href="/login" variant="ghost" size="sm">
                                Login
                            </Button>
                            <Button
                                href="/register"
                                variant="primary"
                                size="sm"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent transition-colors md:hidden"
                    aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
                    aria-expanded={isOpen}
                    aria-controls="landing-mobile-menu"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.nav
                        id="landing-mobile-menu"
                        aria-label="Menu mobile"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{
                            duration: 0.25,
                            ease: [0.23, 1, 0.32, 1],
                        }}
                        className="bg-background-900 border-secondary-800/30 border-t md:hidden"
                    >
                        <div className="flex flex-col gap-1 p-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="text-word-200 hover:text-primary-300 hover:bg-background-800 inline-flex min-h-[48px] items-center px-3 text-sm font-bold tracking-wide uppercase transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}

                            <div className="bg-secondary-800/30 my-3 h-px" />

                            {user ? (
                                <>
                                    <span className="text-word-400 px-3 py-2 font-mono text-xs tracking-wide uppercase">
                                        Conectado como{' '}
                                        <span className="text-primary-300">
                                            {displayName}
                                        </span>
                                    </span>
                                    <Button
                                        href="/dashboard"
                                        variant="ghost"
                                        size="md"
                                        className="justify-start"
                                        leftIcon={
                                            <LayoutDashboard className="h-4 w-4" />
                                        }
                                        onClick={closeMenu}
                                    >
                                        Dashboard
                                    </Button>
                                    <div className="px-3 py-2">
                                        <LogoutButton />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        href="/login"
                                        variant="ghost"
                                        size="md"
                                        className="justify-start"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        href="/register"
                                        variant="primary"
                                        size="md"
                                        className="justify-start"
                                        onClick={closeMenu}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    )
}

export default LandingNavbar
