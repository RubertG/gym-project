/**
 * LandingNavbar — Navegación mobile-first para la landing page.
 * Overlay futurista con animaciones stagger y glassmorphism.
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import type { Profile } from '@/lib/models'
import { LogoutButton } from '@/components/features/auth/LogoutButton'
import { Button } from '@/components/ui/Button'

interface LandingNavbarProps {
    user: { id: string } | null;
    profile: Profile | null;
}

const EASE_INDUSTRIAL = [0.23, 1, 0.32, 1] as const

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
    user,
    profile,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const displayName = profile?.username ?? 'Usuario'

    const toggleMenu = () => setIsOpen((prev) => !prev)
    const closeMenu = () => setIsOpen(false)

    // Bloquear scroll cuando el overlay está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

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

    return (
        <>
            <header className="bg-background-900/80 border-secondary-800/30 sticky top-0 z-40 border-b backdrop-blur-xl">
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
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex min-h-[44px] items-center border-2 border-transparent px-3 py-2 text-sm font-bold tracking-wide uppercase transition-all duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right: auth actions */}
                    <div className="hidden flex-1 basis-0 items-center justify-end gap-3 md:flex">
                        {user ? (
                            <>
                                <span className="text-word-400 font-mono text-xs tracking-wide uppercase">
                                    Conectado como{' '}
                                    <span className="text-primary-300">
                                        {displayName}
                                    </span>
                                </span>
                                <LogoutButton hideLabelOnMobile={false} />
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

                    {/* Mobile toggle */}
                    <div className="flex flex-1 basis-0 items-center justify-end md:hidden">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent transition-colors"
                            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
                            aria-expanded={isOpen}
                            aria-controls="landing-mobile-overlay"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="landing-mobile-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: EASE_INDUSTRIAL,
                        }}
                        className="bg-background-950/95 fixed inset-0 z-50 flex flex-col backdrop-blur-2xl md:hidden"
                    >
                        {/* Overlay header */}
                        <div className="flex h-16 items-center justify-between px-4">
                            <a
                                href="/"
                                className="font-display text-xl font-bold tracking-tight"
                                onClick={closeMenu}
                            >
                                <span className="text-primary-300">IRON</span>{' '}
                                <span className="text-word-100">TRACK</span>
                            </a>
                            <button
                                type="button"
                                onClick={closeMenu}
                                className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent transition-colors"
                                aria-label="Cerrar panel de navegacion"
                            >
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Decorative top line */}
                        <div className="bg-primary-400/20 h-px w-full" />

                        {/* Main nav links */}
                        <motion.nav
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.08,
                                        delayChildren: 0.1,
                                    },
                                },
                            }}
                            className="flex flex-1 flex-col items-center justify-center gap-2 px-6"
                            aria-label="Menu mobile"
                        >
                            {mainLinks.map((link, index) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            x: 60,
                                        },
                                        visible: {
                                            opacity: 1,
                                            x: 0,
                                        },
                                    }}
                                    transition={{
                                        duration: 0.45,
                                        ease: EASE_INDUSTRIAL,
                                    }}
                                    className="group relative inline-flex items-center gap-3 py-3 text-center"
                                >
                                    <span className="text-primary-400/60 font-mono text-xs">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-display text-word-100 group-hover:text-primary-300 text-3xl font-bold tracking-tighter uppercase transition-all duration-300 group-hover:tracking-wide">
                                        {link.label}
                                    </span>
                                    <span className="bg-primary-400 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full" />
                                </motion.a>
                            ))}
                        </motion.nav>

                        {/* Bottom auth section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.35,
                                ease: EASE_INDUSTRIAL,
                            }}
                            className="border-secondary-800/30 border-t px-6 py-8"
                        >
                            {user ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboard className="text-primary-300 h-5 w-5" />
                                        <span className="text-word-400 font-mono text-xs tracking-wide uppercase">
                                            Conectado como{' '}
                                            <span className="text-primary-300">
                                                {displayName}
                                            </span>
                                        </span>
                                    </div>
                                    <LogoutButton hideLabelOnMobile={false} />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Button
                                        href="/login"
                                        variant="ghost"
                                        size="lg"
                                        className="w-full justify-center"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        href="/register"
                                        variant="primary"
                                        size="lg"
                                        className="w-full justify-center"
                                        onClick={closeMenu}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default LandingNavbar
