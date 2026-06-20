import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockContext } from '../__helpers__/mockContext';

// Mock de authService
vi.mock('@/lib/services/authService', () => ({
    signOut: vi.fn(),
}));

const { POST } = await import('./logout');
const authService = await import('@/lib/services/authService');

describe('POST /api/auth/logout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deberia retornar 200 y limpiar cookies de Supabase', async () => {
        vi.mocked(authService.signOut).mockResolvedValue(undefined);

        const ctx = createMockContext({
            cookies:
                'sb-test-auth-token=abc; sb-test-auth-token-code=def; other-cookie=xyz',
        });

        const response = await POST(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);

        // Verificar que se eliminaron las cookies sb-*
        expect(ctx.cookies.delete).toHaveBeenCalledWith('sb-test-auth-token', {
            path: '/',
        });
        expect(ctx.cookies.delete).toHaveBeenCalledWith(
            'sb-test-auth-token-code',
            { path: '/' }
        );
        // La cookie que no empieza con sb- NO debe ser eliminada
        expect(ctx.cookies.delete).not.toHaveBeenCalledWith(
            'other-cookie',
            expect.anything()
        );
    });

    it('deberia ser idempotente: retornar 200 incluso sin cookies de sesion', async () => {
        vi.mocked(authService.signOut).mockResolvedValue(undefined);

        const ctx = createMockContext({ cookies: '' });

        const response = await POST(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
    });

    it('deberia retornar 200 incluso si signOut falla', async () => {
        vi.mocked(authService.signOut).mockRejectedValue(
            new Error('Session expired')
        );

        const ctx = createMockContext({
            cookies: 'sb-test-auth-token=abc',
        });

        const response = await POST(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        // Las cookies deben limpiarse incluso si signOut falla
        expect(ctx.cookies.delete).toHaveBeenCalledWith('sb-test-auth-token', {
            path: '/',
        });
    });
});
