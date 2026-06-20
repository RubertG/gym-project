import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockContext } from '../__helpers__/mockContext'
import type { Profile } from '@/lib/models'

// Mock de createSupabaseServerClient
const mockSignUp = vi.fn()
const mockSignInWithPassword = vi.fn()
vi.mock('@/lib/db/server-client', () => ({
    createSupabaseServerClient: () => ({
        auth: {
            signUp: mockSignUp,
            signInWithPassword: mockSignInWithPassword,
        },
    }),
}))

// Mock de profileService
vi.mock('@/lib/services/profileService', () => ({
    createProfile: vi.fn(),
}))

// Mock de env
vi.mock('@/lib/config/env', () => ({
    env: {
        PUBLIC_SUPABASE_URL: 'https://testproject.supabase.co',
        PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    },
}))

// Mock de getServerClient
vi.mock('@/lib/db/client', () => ({
    getServerClient: () => ({}),
}))

const { POST } = await import('./register')
const profileService = await import('@/lib/services/profileService')

describe('POST /api/auth/register', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deberia retornar 201 en registro exitoso', async () => {
        const mockUser = {
            id: 'user-123',
            email: 'test@example.com',
        }

        const mockProfile = {
            id: 'profile-123',
            username: 'testuser',
        }

        mockSignUp.mockResolvedValue({
            data: { user: mockUser },
            error: null,
        })
        mockSignInWithPassword.mockResolvedValue({
            data: { session: {} },
            error: null,
        })
        vi.mocked(profileService.createProfile).mockResolvedValue(
            mockProfile as Profile
        )

        const ctx = createMockContext({
            body: {
                email: 'test@example.com',
                password: 'Password123',
                username: 'testuser',
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.user).toEqual({
            id: 'user-123',
            email: 'test@example.com',
        })
        expect(data.profile).toEqual({
            id: 'profile-123',
            username: 'testuser',
        })
    })

    it('deberia retornar 409 cuando el email ya esta registrado', async () => {
        mockSignUp.mockResolvedValue({
            data: { user: null },
            error: { message: 'User already registered' },
        })

        const ctx = createMockContext({
            body: {
                email: 'existing@example.com',
                password: 'Password123',
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(409)
        expect(data.error).toBe('Email already registered')
    })

    it('deberia retornar 400 cuando la validacion falla', async () => {
        const ctx = createMockContext({
            body: {
                email: 'test@example.com',
                password: 'short', // muy corta
            },
        })

        const response = await POST(ctx)

        expect(response.status).toBe(400)
    })

    it('deberia retornar 400 cuando el body no es JSON valido', async () => {
        const ctx = createMockContext()
        vi.spyOn(ctx.request, 'json').mockRejectedValue(new SyntaxError())

        const response = await POST(ctx)

        expect(response.status).toBe(400)
    })
})
