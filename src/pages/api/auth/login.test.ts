import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockContext } from '../__helpers__/mockContext';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/models';

// Mock de authService
vi.mock('@/lib/services/authService', () => ({
    signIn: vi.fn(),
}));

// Mock de profileService
vi.mock('@/lib/services/profileService', () => ({
    getProfile: vi.fn(),
}));

// Mock de env para getProjectRef
vi.mock('@/lib/config/env', () => ({
    env: {
        SUPABASE_URL: 'https://testproject.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    },
}));

const { POST } = await import('./login');
const authService = await import('@/lib/services/authService');
const profileService = await import('@/lib/services/profileService');

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deberia retornar 200 y establecer cookies en login exitoso', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            role: 'authenticated',
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as User;

        const mockSession: Session = {
            access_token: 'access-token-123',
            refresh_token: 'refresh-token-123',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser,
        } as Session;

        const mockProfile: Profile = {
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        };

        vi.mocked(authService.signIn).mockResolvedValue({
            session: mockSession,
            user: mockUser,
        });
        vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);

        const ctx = createMockContext({
            body: { email: 'test@example.com', password: 'password123' },
        });

        const response = await POST(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user).toEqual({
            id: 'user-123',
            email: 'test@example.com',
        });
        expect(data.profile).toEqual(mockProfile);

        // Verificar que se establecieron las cookies
        expect(ctx.cookies.set).toHaveBeenCalled();
        // Cookie principal: sb-testproject-auth-token
        expect(ctx.cookies.set).toHaveBeenCalledWith(
            'sb-testproject-auth-token',
            expect.any(String),
            expect.objectContaining({ path: '/', httpOnly: true })
        );
    });

    it('deberia retornar 401 cuando las credenciales son invalidas', async () => {
        const { AuthError } = await import('@/lib/utils/errors');

        vi.mocked(authService.signIn).mockRejectedValue(
            new AuthError('Invalid email or password')
        );

        const ctx = createMockContext({
            body: { email: 'bad@example.com', password: 'wrong' },
        });

        const response = await POST(ctx);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Invalid email or password');
    });

    it('deberia retornar 401 cuando el body tiene formato invalido', async () => {
        const ctx = createMockContext({
            body: { email: 'not-an-email', password: '' },
        });

        const response = await POST(ctx);

        expect(response.status).toBe(401);
    });

    it('deberia retornar 400 cuando el body no es JSON valido', async () => {
        const ctx = createMockContext();
        vi.spyOn(ctx.request, 'json').mockRejectedValue(new SyntaxError());

        const response = await POST(ctx);

        expect(response.status).toBe(400);
    });
});
