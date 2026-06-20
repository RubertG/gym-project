// @vitest-environment jsdom
/**
 * Tests unitarios para RegisterForm.
 * Verifica: password mismatch bloquea submit.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock de useAuth
const mockSignUp = vi.fn();

vi.mock('./useAuth', () => ({
    useAuth: () => ({
        user: null,
        profile: null,
        loading: false,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
    }),
}));

const { RegisterForm } = await import('./RegisterForm');

describe('RegisterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('password mismatch blocks submit', async () => {
        const { container } = render(<RegisterForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;
        const confirmPasswordInput = container.querySelector(
            'input[name="confirmPassword"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'different456' },
        });

        const submitButton = screen.getByRole('button', {
            name: /crear cuenta/i,
        });

        fireEvent.click(submitButton);

        // signUp NO debe haberse llamado (validacion bloqueo el submit)
        expect(mockSignUp).not.toHaveBeenCalled();

        // Debe mostrar error de password mismatch
        expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy();
    });

    it('weak password blocks submit', async () => {
        const { container } = render(<RegisterForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;
        const confirmPasswordInput = container.querySelector(
            'input[name="confirmPassword"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

        const submitButton = screen.getByRole('button', {
            name: /crear cuenta/i,
        });

        fireEvent.click(submitButton);

        expect(mockSignUp).not.toHaveBeenCalled();
        expect(
            screen.getByText('La contraseña debe tener al menos 8 caracteres')
        ).toBeTruthy();
    });

    it('calls signUp with valid data', async () => {
        mockSignUp.mockResolvedValue({ ok: true });

        const { container } = render(<RegisterForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;
        const confirmPasswordInput = container.querySelector(
            'input[name="confirmPassword"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'password123' },
        });

        const submitButton = screen.getByRole('button', {
            name: /crear cuenta/i,
        });

        fireEvent.click(submitButton);

        expect(mockSignUp).toHaveBeenCalledWith(
            'test@example.com',
            'password123',
            undefined
        );
    });

    it('shows field-specific validation errors from server', async () => {
        mockSignUp.mockResolvedValue({
            ok: false,
            error: 'Validation failed',
            details: [
                {
                    field: 'password',
                    message: 'Password must contain at least one letter',
                },
            ],
        });

        const { container } = render(<RegisterForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;
        const confirmPasswordInput = container.querySelector(
            'input[name="confirmPassword"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '12345678' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: '12345678' },
        });

        const submitButton = screen.getByRole('button', {
            name: /crear cuenta/i,
        });

        fireEvent.click(submitButton);

        await vi.waitFor(() => {
            expect(
                screen.getByText(
                    'La contraseña debe contener al menos una letra'
                )
            ).toBeTruthy();
        });
    });
});
