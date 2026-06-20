import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockContext } from '../__helpers__/mockContext';
import type { Profile } from '@/lib/models';

// Mock de profileService
vi.mock('@/lib/services/profileService', () => ({
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
}));

const { GET, PATCH } = await import('./index');
const profileService = await import('@/lib/services/profileService');

describe('GET /api/profile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deberia retornar 200 con el perfil cuando existe', async () => {
        const mockProfile: Profile = {
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            deletedAt: null,
        };

        vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);

        const ctx = createMockContext({ user: { id: 'user-123' } });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
        });
    });

    it('deberia retornar 404 cuando el perfil no existe', async () => {
        vi.mocked(profileService.getProfile).mockResolvedValue(null);

        const ctx = createMockContext({ user: { id: 'user-123' } });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Profile not found');
    });

    it('deberia retornar 401 cuando no hay sesion', async () => {
        const ctx = createMockContext({ user: null });

        const response = await GET(ctx);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });
});

describe('PATCH /api/profile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deberia retornar 200 con perfil actualizado en update exitoso', async () => {
        const updatedProfile: Profile = {
            id: 'profile-123',
            username: 'newname',
            avatarUrl: 'https://example.com/avatar.jpg',
            role: 'user',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
            deletedAt: null,
        };

        vi.mocked(profileService.updateProfile).mockResolvedValue(
            updatedProfile
        );

        const ctx = createMockContext({
            user: { id: 'user-123' },
            body: {
                username: 'NewName',
                avatarUrl: 'https://example.com/avatar.jpg',
            },
        });

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.username).toBe('newname');
        expect(data.avatarUrl).toBe('https://example.com/avatar.jpg');

        // Verificar que username fue normalizado a lowercase
        expect(profileService.updateProfile).toHaveBeenCalledWith('user-123', {
            username: 'newname',
            avatarUrl: 'https://example.com/avatar.jpg',
        });
    });

    it('deberia retornar 400 cuando el body esta vacio', async () => {
        const ctx = createMockContext({
            user: { id: 'user-123' },
            body: {},
        });

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('At least one field required');
    });

    it('deberia retornar 409 cuando el username ya esta en uso', async () => {
        const { ValidationError } = await import('@/lib/utils/errors');

        vi.mocked(profileService.updateProfile).mockRejectedValue(
            new ValidationError('El nombre de usuario ya está en uso')
        );

        const ctx = createMockContext({
            user: { id: 'user-123' },
            body: { username: 'taken' },
        });

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe('Username already in use');
    });

    it('deberia retornar 400 cuando username es invalido', async () => {
        const ctx = createMockContext({
            user: { id: 'user-123' },
            body: { username: 'ab' }, // muy corto
        });

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Validation failed');
        expect(data.details.length).toBeGreaterThan(0);
    });

    it('deberia retornar 401 cuando no hay sesion', async () => {
        const ctx = createMockContext({
            user: null,
            body: { username: 'newname' },
        });

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('deberia retornar 400 cuando el body no es JSON valido', async () => {
        const ctx = createMockContext({ user: { id: 'user-123' } });
        vi.spyOn(ctx.request, 'json').mockRejectedValue(new SyntaxError());

        const response = await PATCH(ctx);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('At least one field required');
    });
});
