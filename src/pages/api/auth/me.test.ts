import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockContext } from '../__helpers__/mockContext';
import type { Profile } from '@/lib/models';

// Mock de profileService
vi.mock('@/lib/services/profileService', () => ({
    getProfile: vi.fn(),
}));

const { GET } = await import('./me');
const profileService = await import('@/lib/services/profileService');

describe('GET /api/auth/me', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deberia retornar 200 con user y profile cuando hay sesion', async () => {
        const mockProfile: Profile = {
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        };

        vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);

        const ctx = createMockContext({
            user: { id: 'user-123' },
        });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user).toEqual({ id: 'user-123' });
        expect(data.profile).toEqual(mockProfile);
        expect(profileService.getProfile).toHaveBeenCalledWith('user-123');
    });

    it('deberia retornar 401 cuando no hay sesion', async () => {
        const ctx = createMockContext({ user: null });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('deberia retornar profile null si el usuario no tiene perfil', async () => {
        vi.mocked(profileService.getProfile).mockResolvedValue(null);

        const ctx = createMockContext({
            user: { id: 'user-no-profile' },
        });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.user).toEqual({ id: 'user-no-profile' });
        expect(data.profile).toBeNull();
    });
});
