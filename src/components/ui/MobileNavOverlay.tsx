/**
 * MobileNavOverlay — Menu mobile full-screen reusable con animaciones stagger.
 * Usado por LandingNavbar y DashboardMobileNav.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export interface MobileNavLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface MobileNavOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    links: MobileNavLink[];
    footer?: React.ReactNode;
    brandHref?: string;
}

const EASE_INDUSTRIAL = [0.23, 1, 0.32, 1] as const

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
}

const listVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
}

export const MobileNavOverlay: React.FC<MobileNavOverlayProps> = ({
    isOpen,
    onClose,
    links,
    footer,
    brandHref = '/',
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={overlayVariants}
                    transition={{
                        duration: 0.35,
                        ease: EASE_INDUSTRIAL,
                    }}
                    className="bg-background-950/95 fixed inset-0 z-50 flex flex-col backdrop-blur-2xl md:hidden"
                    aria-hidden={!isOpen}
                >
                    {/* Header */}
                    <div className="flex h-16 shrink-0 items-center justify-between px-4">
                        <a
                            href={brandHref}
                            className="font-display text-xl font-bold tracking-tight"
                            onClick={onClose}
                        >
                            <span className="text-primary-300">IRON</span>{' '}
                            <span className="text-word-100">TRACK</span>
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent transition-colors"
                            aria-label="Cerrar panel de navegacion"
                        >
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Decorative line */}
                    <div className="bg-primary-400/20 h-px w-full shrink-0" />

                    {/* Links */}
                    <motion.nav
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={listVariants}
                        className="flex flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-6 py-8"
                        aria-label="Menu mobile"
                    >
                        {links.map((link, index) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                variants={itemVariants}
                                transition={{
                                    duration: 0.45,
                                    ease: EASE_INDUSTRIAL,
                                }}
                                className="group relative inline-flex items-center gap-3 py-3 text-center"
                            >
                                {link.icon && (
                                    <span className="text-primary-400/60">
                                        {link.icon}
                                    </span>
                                )}
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

                    {/* Footer */}
                    {footer && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.35,
                                ease: EASE_INDUSTRIAL,
                            }}
                            className="border-secondary-800/30 shrink-0 border-t px-6 py-8"
                        >
                            {footer}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MobileNavOverlay
