import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as profileRepo from '@/lib/repositories/profileRepository';
import { ValidationError, NotFoundError } from '@/lib/utils/errors';
import type { Profile } from '@/lib/models';

// Mock dependencies
vi.mock('@/lib/db/client', () => ({
    getServerClient: vi.fn(() => ({})),
}));

vi.mock('@/lib/repositories/profileRepository');

const { createProfile, updateProfile, softDeleteProfile } =
    await import('./profileService');

describe('profileService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createProfile', () => {
        it('should create profile without username', async () => {
            const mockProfile: Profile = {
                id: 'profile-1',
                userId: 'user-1',
                username: null,
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.createProfile).mockResolvedValue(mockProfile);

            const result = await createProfile('user-1');

            expect(result).toEqual(mockProfile);
            expect(profileRepo.createProfile).toHaveBeenCalledWith(
                expect.anything(),
                'user-1',
                undefined
            );
        });

        it('should throw ValidationError if username is too short', async () => {
            await expect(createProfile('user-1', 'ab')).rejects.toThrow(
                ValidationError
            );
            await expect(createProfile('user-1', 'ab')).rejects.toThrow(
                'al menos 3 caracteres'
            );
        });

        it('should throw ValidationError if username is exactly 2 chars', async () => {
            await expect(createProfile('user-1', 'xy')).rejects.toThrow(
                ValidationError
            );
        });

        it('should throw ValidationError if username already exists', async () => {
            const existingProfile: Profile = {
                id: 'existing',
                userId: 'user-2',
                username: 'taken',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                existingProfile
            );

            await expect(createProfile('user-1', 'taken')).rejects.toThrow(
                ValidationError
            );
            await expect(createProfile('user-1', 'taken')).rejects.toThrow(
                'ya está en uso'
            );
        });

        it('should normalize username to lowercase and trimmed', async () => {
            const mockProfile: Profile = {
                id: 'profile-1',
                userId: 'user-1',
                username: 'testuser',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                null
            );
            vi.mocked(profileRepo.createProfile).mockResolvedValue(mockProfile);

            await createProfile('user-1', '  TestUser  ');

            expect(profileRepo.createProfile).toHaveBeenCalledWith(
                expect.anything(),
                'user-1',
                'testuser'
            );
        });

        it('should create profile with valid username', async () => {
            const mockProfile: Profile = {
                id: 'profile-1',
                userId: 'user-1',
                username: 'validuser',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                null
            );
            vi.mocked(profileRepo.createProfile).mockResolvedValue(mockProfile);

            const result = await createProfile('user-1', 'validuser');

            expect(result.username).toBe('validuser');
        });
    });

    describe('updateProfile', () => {
        const mockProfile: Profile = {
            id: 'profile-1',
            userId: 'user-1',
            username: 'oldname',
            role: 'user',
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        it('should throw NotFoundError if profile does not exist', async () => {
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(null);

            await expect(
                updateProfile('non-existent', { username: 'newname' })
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw ValidationError if new username is too short', async () => {
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                mockProfile
            );

            await expect(
                updateProfile('user-1', { username: 'ab' })
            ).rejects.toThrow(ValidationError);
            await expect(
                updateProfile('user-1', { username: 'ab' })
            ).rejects.toThrow('al menos 3 caracteres');
        });

        it('should throw ValidationError if username already taken by another user', async () => {
            const otherProfile: Profile = {
                id: 'other-profile',
                userId: 'user-2',
                username: 'taken',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                mockProfile
            );
            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                otherProfile
            );

            await expect(
                updateProfile('user-1', { username: 'taken' })
            ).rejects.toThrow(ValidationError);
            await expect(
                updateProfile('user-1', { username: 'taken' })
            ).rejects.toThrow('ya está en uso');
        });

        it('should allow keeping same username', async () => {
            // El perfil existente tiene id = userId (mismo usuario)
            const sameProfile: Profile = {
                id: 'user-1', // id es igual al userId
                userId: 'user-1',
                username: 'oldname',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                sameProfile
            );
            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                sameProfile
            );
            vi.mocked(profileRepo.updateProfile).mockResolvedValue(sameProfile);

            const result = await updateProfile('user-1', {
                username: 'oldname',
            });

            expect(result).toEqual(sameProfile);
        });

        it('should normalize username to lowercase', async () => {
            const updatedProfile = { ...mockProfile, username: 'newname' };

            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                mockProfile
            );
            vi.mocked(profileRepo.findProfileByUsername).mockResolvedValue(
                null
            );
            vi.mocked(profileRepo.updateProfile).mockResolvedValue(
                updatedProfile
            );

            await updateProfile('user-1', { username: 'NewName' });

            expect(profileRepo.updateProfile).toHaveBeenCalledWith(
                expect.anything(),
                'user-1',
                { username: 'newname' }
            );
        });

        it('should update avatar without changing username', async () => {
            const updatedProfile = {
                ...mockProfile,
                avatarUrl: 'https://example.com/avatar.jpg',
            };

            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                mockProfile
            );
            vi.mocked(profileRepo.updateProfile).mockResolvedValue(
                updatedProfile
            );

            const result = await updateProfile('user-1', {
                avatarUrl: 'https://example.com/avatar.jpg',
            });

            expect(result.avatarUrl).toBe('https://example.com/avatar.jpg');
            expect(profileRepo.findProfileByUsername).not.toHaveBeenCalled();
        });
    });

    describe('softDeleteProfile', () => {
        const mockProfile: Profile = {
            id: 'profile-1',
            userId: 'user-1',
            username: 'testuser',
            role: 'user',
            avatarUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        it('should throw NotFoundError if profile does not exist', async () => {
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(null);

            await expect(softDeleteProfile('non-existent')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should soft delete existing profile', async () => {
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                mockProfile
            );
            vi.mocked(profileRepo.softDeleteProfile).mockResolvedValue();

            await expect(softDeleteProfile('user-1')).resolves.toBeUndefined();
            expect(profileRepo.softDeleteProfile).toHaveBeenCalled();
        });
    });
});
