import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockContext } from '../__helpers__/mockContext'
import type { Profile } from '@/lib/models'

// Mock de profileService
vi.mock('@/lib/services/profileService', () => ({
    getProfile: vi.fn(),
}))

// Mock de getServerClient
vi.mock('@/lib/db/client', () => ({
    getServerClient: () => ({}),
}))

// Mock de env
vi.mock('@/lib/config/env', () => ({
    env: {
        PUBLIC_SUPABASE_URL: 'https://testproject.supabase.co',
        PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    },
}))

const { GET } = await import('./me')
const profileService = await import('@/lib/services/profileService')

describe('GET /api/auth/me', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deberia retornar 200 con user y profile cuando hay sesion', async () => {
        const mockProfile: Profile = {
            id: 'profile-123',
            username: 'testuser',
            avatarUrl: null,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        }

        vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile)

        const ctx = createMockContext()
        ctx.locals.user = { id: 'user-123' }

        const response = await GET(ctx)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.user).toEqual({ id: 'user-123' })
        expect(data.profile).toEqual(mockProfile)
    })

    it('deberia retornar 401 cuando no hay sesion', async () => {
        const ctx = createMockContext()
        ctx.locals.user = null

        const response = await GET(ctx)
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data.error).toBe('Unauthorized')
    })

    it('deberia retornar profile null cuando no existe perfil', async () => {
        vi.mocked(profileService.getProfile).mockResolvedValue(null)

        const ctx = createMockContext()
        ctx.locals.user = { id: 'user-123' }

        const response = await GET(ctx)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.profile).toBeNull()
    })
})
