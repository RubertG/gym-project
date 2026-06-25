/**
 * LogoutButton — Isla React para cerrar sesion.
 * POST /api/auth/logout y redirige a /login.
 */

import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface LogoutButtonProps {
    hideLabelOnMobile?: boolean
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    hideLabelOnMobile = true,
}) => {
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)

        try {
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch {
            // Even if the request fails, redirect to login
        }

        window.location.href = '/login'
    }

    const labelClass = hideLabelOnMobile ? 'hidden sm:inline' : 'inline'

    return (
        <Button
            variant="ghost-danger"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
            loading={loading}
            disabled={loading}
            aria-label="Cerrar sesion"
        >
            <span className={labelClass}>Logout</span>
        </Button>
    )
}

export default LogoutButton
