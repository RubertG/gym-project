/**
 * LoginForm — Isla React para inicio de sesion.
 * Validacion client-side, submit via fetch a /api/auth/login.
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
            newErrors.email = 'Email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
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
                placeholder="your@email.com"
                autoComplete="email"
                error={errors.email}
                surface="dark"
                isRequired
            />

            <Input
                label="Password"
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
                size="lg"
                loading={submitting}
                disabled={submitting}
                className="w-full rounded-none"
            >
                Sign In
            </Button>

            <p className="text-word-400 text-center text-sm">
                Don&apos;t have an account?{' '}
                <a
                    href="/register"
                    className="text-primary-300 hover:text-primary-200 font-bold transition-colors"
                >
                    Register
                </a>
            </p>
        </form>
    );
};

export default LoginForm;
