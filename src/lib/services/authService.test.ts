import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationError, AuthError } from '@/lib/utils/errors';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/models';

// Mock del cliente anon de Supabase
const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockGetSession = vi.fn();

vi.mock('@/lib/db/browser-client', () => ({
    getAnonClient: vi.fn(() => ({
        auth: {
            signUp: mockSignUp,
            signInWithPassword: mockSignInWithPassword,
            signOut: mockSignOut,
            resetPasswordForEmail: mockResetPasswordForEmail,
            getSession: mockGetSession,
        },
    })),
}));

// Mock del profileService
vi.mock('@/lib/services/profileService', () => ({
    createProfile: vi.fn(),
}));

// Import dinámico después de los mocks
const { signUp, signIn, signOut, getCurrentSession } =
    await import('./authService');
const { createProfile } = await import('@/lib/services/profileService');

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('signUp', () => {
        it('should create user and profile on success', async () => {
            const mockUser: User = {
                id: 'user-123',
                email: 'test@example.com',
                role: 'authenticated',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as User;

            const mockProfile: Profile = {
                id: 'user-123',
                username: 'testuser',
                avatarUrl: null,
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                deletedAt: null,
            };

            mockSignUp.mockResolvedValue({
                data: { user: mockUser },
                error: null,
            });
            vi.mocked(createProfile).mockResolvedValue(mockProfile);

            const result = await signUp({
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser',
            });

            expect(result.user).toEqual(mockUser);
            expect(result.profile).toEqual(mockProfile);
            expect(mockSignUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(createProfile).toHaveBeenCalledWith('user-123', 'testuser');
        });

        it('should throw ValidationError on duplicate email', async () => {
            mockSignUp.mockResolvedValue({
                data: { user: null },
                error: {
                    message: 'User already registered',
                    code: 'email_taken',
                },
            });

            await expect(
                signUp({ email: 'taken@example.com', password: 'password123' })
            ).rejects.toThrow(ValidationError);
            await expect(
                signUp({ email: 'taken@example.com', password: 'password123' })
            ).rejects.toThrow('Email already registered');
        });

        it('should return user even if profile creation fails (best-effort)', async () => {
            const mockUser: User = {
                id: 'user-456',
                email: 'test@example.com',
                role: 'authenticated',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as User;

            mockSignUp.mockResolvedValue({
                data: { user: mockUser },
                error: null,
            });
            vi.mocked(createProfile).mockRejectedValue(new Error('DB error'));

            const result = await signUp({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result.user).toEqual(mockUser);
            expect(result.profile).toBeNull();
            expect(createProfile).toHaveBeenCalledWith('user-456', undefined);
        });
    });

    describe('signIn', () => {
        it('should return session and user on success', async () => {
            const mockUser: User = {
                id: 'user-123',
                email: 'test@example.com',
                role: 'authenticated',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as User;

            const mockSession: Session = {
                access_token: 'token',
                refresh_token: 'refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser,
            } as Session;

            mockSignInWithPassword.mockResolvedValue({
                data: { session: mockSession, user: mockUser },
                error: null,
            });

            const result = await signIn({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result.session).toEqual(mockSession);
            expect(result.user).toEqual(mockUser);
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        it('should throw AuthError on invalid credentials', async () => {
            mockSignInWithPassword.mockResolvedValue({
                data: { session: null, user: null },
                error: {
                    message: 'Invalid login credentials',
                    code: 'invalid_credentials',
                },
            });

            await expect(
                signIn({ email: 'bad@example.com', password: 'wrong' })
            ).rejects.toThrow(AuthError);
            await expect(
                signIn({ email: 'bad@example.com', password: 'wrong' })
            ).rejects.toThrow('Invalid email or password');
        });
    });

    describe('signOut', () => {
        it('should delegate to Supabase signOut', async () => {
            mockSignOut.mockResolvedValue({ error: null });

            await expect(signOut()).resolves.toBeUndefined();
            expect(mockSignOut).toHaveBeenCalled();
        });
    });

    describe('getCurrentSession', () => {
        it('should return session and user when session exists', async () => {
            const mockUser: User = {
                id: 'user-123',
                email: 'test@example.com',
                role: 'authenticated',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
            } as User;

            const mockSession: Session = {
                access_token: 'token',
                refresh_token: 'refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser,
            } as Session;

            mockGetSession.mockResolvedValue({
                data: { session: mockSession, user: mockUser },
                error: null,
            });

            const result = await getCurrentSession();

            expect(result.session).toEqual(mockSession);
            expect(result.user).toEqual(mockUser);
        });

        it('should return nulls when no session exists', async () => {
            mockGetSession.mockResolvedValue({
                data: { session: null, user: null },
                error: null,
            });

            const result = await getCurrentSession();

            expect(result.session).toBeNull();
            expect(result.user).toBeNull();
        });
    });
});
