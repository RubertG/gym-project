/**
 * LoginForm — React island for login.
 * Client-side validation, submit via fetch to /api/auth/login.
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from './useAuth';

export const LoginForm: React.FC = () => {
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);
        setErrors({});

        const result = await signIn(email, password);

        if (!result.ok) {
            // Si hay detalles de validación del servidor, mapearlos a los campos
            if (result.details && result.details.length > 0) {
                const fieldErrors: Record<string, string> = {};
                result.details.forEach((detail) => {
                    // Traducir mensajes de error del servidor
                    const translatedMessage = translateErrorMessage(
                        detail.field,
                        detail.message
                    );
                    fieldErrors[detail.field] = translatedMessage;
                });
                setErrors(fieldErrors);
            } else {
                // Error genérico (credenciales inválidas, etc.)
                setErrors({
                    form: translateErrorMessage('form', result.error),
                });
            }
            setSubmitting(false);

            return;
        }

        // eslint-disable-next-line react-hooks/immutability
        window.location.href = '/dashboard';
    };

    // Función para traducir mensajes de error del servidor
    const translateErrorMessage = (field: string, message: string): string => {
        const translations: Record<string, string> = {
            'Invalid email or password': 'Email o contraseña inválidos',
            'Invalid email': 'Email inválido',
            'Password must be at least 8 characters':
                'La contraseña debe tener al menos 8 caracteres',
            'Email is required': 'El email es requerido',
            'Password is required': 'La contraseña es requerida',
        };

        return translations[message] || message;
    };

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
                label="Contraseña"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password}
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
                loading={submitting}
                disabled={submitting}
                className="w-full rounded-none"
            >
                Iniciar Sesión
            </Button>

            <p className="text-word-400 text-center text-sm">
                ¿No tienes cuenta?{' '}
                <a
                    href="/register"
                    className="text-primary-300 hover:text-primary-200 font-bold transition-colors"
                >
                    Regístrate
                </a>
            </p>
        </form>
    );
};

export default LoginForm;
