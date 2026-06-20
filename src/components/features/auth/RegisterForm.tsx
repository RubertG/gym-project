/**
 * RegisterForm — React island for user registration.
 * Client-side validation (password match, min length), submit via fetch to /api/auth/register.
 */

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from './useAuth';

export const RegisterForm: React.FC = () => {
    const { signUp } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 8) {
            newErrors.password =
                'La contraseña debe tener al menos 8 caracteres';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);
        setErrors({});

        const result = await signUp(email, password, username || undefined);

        if (!result.ok) {
            setErrors({ form: result.error });
            setSubmitting(false);

            return;
        }

        window.location.href = '/dashboard';
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
                label="Usuario"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="opcional"
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
    );
};

export default RegisterForm;
