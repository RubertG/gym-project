/**
 * Hook de autenticacion para componentes React (islas).
 * Provee estado de sesion y metodos de auth via API routes.
 */

import { useState, useEffect, useCallback } from 'react'
import { getBrowserClient } from '@/lib/db/browser-client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/models'

interface ValidationError {
    field: string
    message: string
}

interface UseAuthReturn {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (
        email: string,
        password: string
    ) => Promise<
        { ok: true } | { ok: false; error: string; details?: ValidationError[] }
    >
    signUp: (
        email: string,
        password: string,
        username?: string
    ) => Promise<
        { ok: true } | { ok: false; error: string; details?: ValidationError[] }
    >
    signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    // Cargar sesion al montar el componente
    useEffect(() => {
        let cancelled = false

        async function loadSession() {
            try {
                const supabase = getBrowserClient()
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser()

                if (!cancelled && user && !error) {
                    setUser(user)

                    // Obtener perfil via API
                    const res = await fetch('/api/auth/me')

                    if (res.ok) {
                        const data = await res.json()

                        if (!cancelled) {
                            setProfile(data.profile ?? null)
                        }
                    }
                }
            } catch {
                // Sesion no disponible, dejar user/profile como null
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadSession()

        return () => {
            cancelled = true
        }
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            return {
                ok: false as const,
                error: data.error ?? 'Login failed',
                details: data.details,
            }
        }

        setUser(data.user ?? null)
        setProfile(data.profile ?? null)

        return { ok: true as const }
    }, [])

    const signUp = useCallback(
        async (email: string, password: string, username?: string) => {
            const body: Record<string, string> = { email, password }

            if (username) {
                body.username = username
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await res.json()

            if (!res.ok) {
                return {
                    ok: false as const,
                    error: data.error ?? 'Registration failed',
                    details: data.details,
                }
            }

            // El registro no establece cookies de sesion.
            // Hacer login automaticamente para crear la sesion.
            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (loginRes.ok) {
                const loginData = await loginRes.json()

                setUser(loginData.user ?? null)
                setProfile(loginData.profile ?? null)
            }

            return { ok: true as const }
        },
        []
    )

    const signOut = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        setProfile(null)
        window.location.href = '/login'
    }, [])

    return { user, profile, loading, signIn, signUp, signOut }
}

export default useAuth
