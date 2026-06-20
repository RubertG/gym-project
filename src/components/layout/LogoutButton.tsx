/**
 * LogoutButton — Isla React para cerrar sesion.
 * POST /api/auth/logout y redirige a /login.
 */

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

export const LogoutButton: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
            // Even if the request fails, redirect to login
        }

        window.location.href = '/login';
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="text-word-300 hover:text-primary-300 hover:border-primary-400/30 inline-flex cursor-pointer items-center gap-2 rounded-none border-2 border-transparent px-3 py-2 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar sesion"
        >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
        </button>
    );
};

export default LogoutButton;
