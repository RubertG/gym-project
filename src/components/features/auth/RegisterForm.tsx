/**
 * RegisterForm — Isla React para registro de usuarios.
 * Validacion client-side (password match, min length), submit via fetch a /api/auth/register.
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
            newErrors.email = 'Email is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
                placeholder="your@email.com"
                autoComplete="email"
                error={errors.email}
                surface="dark"
                isRequired
            />

            <Input
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="optional"
                autoComplete="username"
                surface="dark"
            />

            <Input
                label="Password"
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
                label="Confirm Password"
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
                Create Account
            </Button>

            <p className="text-word-400 text-center text-sm">
                Already have an account?{' '}
                <a
                    href="/login"
                    className="text-primary-300 hover:text-primary-200 font-bold transition-colors"
                >
                    Sign In
                </a>
            </p>
        </form>
    );
};

export default RegisterForm;
