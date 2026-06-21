/**
 * DashboardMobileNav — Header + menu mobile full-screen para el dashboard.
 * Reutiliza MobileNavOverlay con las rutas del dashboard.
 */

import React, { useState } from 'react'
import { Menu, LayoutGrid, User } from 'lucide-react'
import type { Profile } from '@/lib/models'
import { LogoutButton } from '@/components/features/auth/LogoutButton'
import { MobileNavOverlay } from '@/components/ui/MobileNavOverlay'

interface DashboardMobileNavProps {
    user: { id: string } | null;
    profile: Profile | null;
}

const dashboardLinks = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutGrid className="h-5 w-5" />,
    },
    {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: <User className="h-5 w-5" />,
    },
]

export const DashboardMobileNav: React.FC<DashboardMobileNavProps> = ({
    user,
    profile,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const displayName = profile?.username ?? user?.id ?? 'User'

    const toggleMenu = () => setIsOpen((prev) => !prev)
    const closeMenu = () => setIsOpen(false)

    const footer = (
        <div className="flex flex-col items-center gap-4">
            <span className="text-primary-300 font-mono text-sm font-bold tracking-wide uppercase">
                {displayName}
            </span>
            <LogoutButton hideLabelOnMobile={false} />
        </div>
    )

    return (
        <>
            <button
                type="button"
                onClick={toggleMenu}
                className="text-word-300 hover:text-primary-300 cursor-pointer rounded-none p-2 transition-colors"
                aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
                aria-expanded={isOpen}
                aria-controls="dashboard-mobile-overlay"
            >
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <span className="font-display text-lg font-bold tracking-tight">
                <span className="text-primary-300">IRON</span> TRACK
            </span>

            <div className="w-10" />

            <MobileNavOverlay
                isOpen={isOpen}
                onClose={closeMenu}
                links={dashboardLinks}
                footer={footer}
                brandHref="/dashboard"
            />
        </>
    )
}

export default DashboardMobileNav
