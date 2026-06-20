// @vitest-environment jsdom
/**
 * Tests unitarios para LoginForm.
 * Verifica: validacion client-side bloquea submit con email vacio.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock de useAuth
const mockSignIn = vi.fn();

vi.mock('./useAuth', () => ({
    useAuth: () => ({
        user: null,
        profile: null,
        loading: false,
        signIn: mockSignIn,
        signUp: vi.fn(),
        signOut: vi.fn(),
    }),
}));

const { LoginForm } = await import('./LoginForm');

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('client validation blocks submit on empty email', async () => {
        const { container } = render(<LoginForm />);

        // Dejar email vacio, escribir solo password
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;

        fireEvent.change(passwordInput, { target: { value: 'somepassword' } });

        // Hacer submit
        const submitButton = screen.getByRole('button', {
            name: /iniciar sesión/i,
        });

        fireEvent.click(submitButton);

        // signIn NO debe haberse llamado (validacion bloqueo el submit)
        expect(mockSignIn).not.toHaveBeenCalled();

        // Debe mostrar error de email requerido
        expect(screen.getByText('El email es requerido')).toBeTruthy();
    });

    it('calls signIn with valid credentials', async () => {
        mockSignIn.mockResolvedValue({ ok: true });

        const { container } = render(<LoginForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', {
            name: /iniciar sesión/i,
        });

        fireEvent.click(submitButton);

        expect(mockSignIn).toHaveBeenCalledWith(
            'test@example.com',
            'password123'
        );
    });

    it('shows error message on failed login', async () => {
        mockSignIn.mockResolvedValue({
            ok: false,
            error: 'Invalid email or password',
        });

        const { container } = render(<LoginForm />);

        const emailInput = container.querySelector('input[name="email"]')!;
        const passwordInput = container.querySelector(
            'input[name="password"]'
        )!;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });

        const submitButton = screen.getByRole('button', {
            name: /iniciar sesión/i,
        });

        fireEvent.click(submitButton);

        await vi.waitFor(() => {
            expect(screen.getByText('Invalid email or password')).toBeTruthy();
        });
    });
});
