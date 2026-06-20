import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockContext } from '../__helpers__/mockContext'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/models'

// Mock de authService
vi.mock('@/lib/services/authService', () => ({
    signUp: vi.fn(),
}))

// Mock de profileService (usado indirectamente por authService)
vi.mock('@/lib/services/profileService', () => ({
    createProfile: vi.fn(),
}))

const { POST } = await import('./register')
const authService = await import('@/lib/services/authService')

describe('POST /api/auth/register', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deberia retornar 201 con user y profile en registro exitoso', async () => {
        const mockUser: User = {
            id: 'user-123',
            email: 'test@example.com',
            role: 'authenticated',
            aud: 'authenticated',
            created_at: new Date().toISOString(),
        } as User

        const mockProfile: Profile = {
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        }

        vi.mocked(authService.signUp).mockResolvedValue({
            user: mockUser,
            profile: mockProfile,
        })

        const ctx = createMockContext({
            body: {
                email: 'test@example.com',
                password: 'password123',
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

    it('deberia retornar 400 con detalles cuando el input es invalido', async () => {
        const ctx = createMockContext({
            body: {
                email: 'not-an-email',
                password: 'short',
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
        expect(Array.isArray(data.details)).toBe(true)
        expect(data.details.length).toBeGreaterThan(0)
    })

    it('deberia retornar 400 cuando falta el password', async () => {
        const ctx = createMockContext({
            body: { email: 'test@example.com' },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
        expect(data.details.length).toBeGreaterThan(0)
    })

    it('deberia retornar 409 cuando el email ya esta registrado', async () => {
        vi.mocked(authService.signUp).mockRejectedValue(
            new (await import('@/lib/utils/errors')).ValidationError(
                'Email already registered'
            )
        )

        const ctx = createMockContext({
            body: {
                email: 'taken@example.com',
                password: 'password123',
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(409)
        expect(data.error).toBe('Email already registered')
    })

    it('deberia retornar 400 cuando el body no es JSON valido', async () => {
        const ctx = createMockContext()
        // Override json() para que falle
        vi.spyOn(ctx.request, 'json').mockRejectedValue(new SyntaxError())

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
    })

    it('deberia validar que password tenga al menos una letra y un numero', async () => {
        const ctx = createMockContext({
            body: {
                email: 'test@example.com',
                password: '12345678', // solo numeros
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(
            data.details.some((d: { message: string }) =>
                d.message.includes('letter')
            )
        ).toBe(true)
    })

    it('deberia validar formato de username (solo alphanumeric + underscores)', async () => {
        const ctx = createMockContext({
            body: {
                email: 'test@example.com',
                password: 'password123',
                username: 'invalid user!',
            },
        })

        const response = await POST(ctx)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(
            data.details.some((d: { field: string }) => d.field === 'username')
        ).toBe(true)
    })
})
