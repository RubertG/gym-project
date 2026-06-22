/**
 * RegisterForm — React island for user registration.
 * Client-side validation (password match, min length), submit via fetch to /api/auth/register.
 */

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from './useAuth'

export const RegisterForm: React.FC = () => {
    const { signUp } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!email.trim()) {
            newErrors.email = 'El email es requerido'
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida'
        } else if (password.length < 8) {
            newErrors.password =
                'La contraseña debe tener al menos 8 caracteres'
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setSubmitting(true)
        setErrors({})

        const result = await signUp(email, password, username || undefined)

        if (!result.ok) {
            // Si hay detalles de validación del servidor, mapearlos a los campos
            if (result.details && result.details.length > 0) {
                const fieldErrors: Record<string, string> = {}
                result.details.forEach((detail) => {
                    // Traducir mensajes de error del servidor
                    const translatedMessage = translateErrorMessage(
                        detail.field,
                        detail.message
                    )
                    fieldErrors[detail.field] = translatedMessage
                })
                setErrors(fieldErrors)
            } else {
                // Error genérico
                setErrors({
                    form: translateErrorMessage('form', result.error),
                })
            }
            setSubmitting(false)

            return
        }

        // eslint-disable-next-line react-hooks/immutability
        window.location.href = '/dashboard'
    }

    // Función para traducir mensajes de error del servidor
    const translateErrorMessage = (field: string, message: string): string => {
        const translations: Record<string, string> = {
            'Password must contain at least one letter':
                'La contraseña debe contener al menos una letra',
            'Password must contain at least one number':
                'La contraseña debe contener al menos un número',
            'Password must be at least 8 characters':
                'La contraseña debe tener al menos 8 caracteres',
            'Username must be at least 3 characters':
                'El nombre de usuario debe tener al menos 3 caracteres',
            'Username must be at most 30 characters':
                'El nombre de usuario debe tener como máximo 30 caracteres',
            'Username must contain only letters, numbers and underscores':
                'El nombre de usuario solo puede contener letras, números y guiones bajos',
            'Invalid email': 'Email inválido',
            'Email already registered': 'Este email ya está registrado',
        }

        return translations[message] || message
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
        >
            <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                error={errors.email}
                surface="dark"
                isRequired
            />

            <Input
                label="Usuario"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                autoComplete="username"
                surface="dark"
            />

            <Input
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.password}
                surface="dark"
                isRequired
            />

            <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.confirmPassword}
                surface="dark"
                isRequired
            />

            {errors.form && (
                <p className="text-sm text-red-500" role="alert">
                    {errors.form}
                </p>
            )}

            <Button
                type="submit"
                variant="primary"
                surface="dark"
                size="lg"
                loading={submitting}
                disabled={submitting}
                className="w-full rounded-none"
            >
                Crear Cuenta
            </Button>

            <p className="text-word-400 text-center text-sm">
                ¿Ya tienes cuenta?{' '}
                <a
                    href="/login"
                    className="text-primary-300 hover:text-primary-200 font-bold transition-colors"
                >
                    Inicia Sesión
                </a>
            </p>
        </form>
    )
}

export default RegisterForm
