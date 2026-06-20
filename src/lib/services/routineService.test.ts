import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as routineRepo from '@/lib/repositories/routineRepository'
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors'
import type { Routine, RoutineDay, RoutineLike } from '@/lib/models'

// Mock dependencies
vi.mock('@/lib/db/client', () => ({
    getServerClient: vi.fn(() => ({})),
}))

vi.mock('@/lib/repositories/routineRepository')
vi.mock('@/lib/repositories/exerciseRepository')

// Import after mocks
const {
    createRoutine,
    updateRoutine,
    activateRoutine,
    publishRoutine,
    softDeleteRoutine,
    likeRoutine,
    unlikeRoutine,
} = await import('./routineService')

describe('routineService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createRoutine', () => {
        it('should throw ValidationError if name is empty', async () => {
            await expect(createRoutine('user-1', '', [])).rejects.toThrow(
                ValidationError
            )
            await expect(createRoutine('user-1', '', [])).rejects.toThrow(
                'El nombre de la rutina es obligatorio'
            )
        })

        it('should throw ValidationError if name is only whitespace', async () => {
            await expect(createRoutine('user-1', '   ', [])).rejects.toThrow(
                ValidationError
            )
        })

        it('should throw ValidationError if days array is empty', async () => {
            await expect(
                createRoutine('user-1', 'Push Pull Legs', [])
            ).rejects.toThrow(ValidationError)
            await expect(
                createRoutine('user-1', 'Push Pull Legs', [])
            ).rejects.toThrow('al menos un día configurado')
        })

        it('should create routine with valid data', async () => {
            const mockRoutine: Routine = {
                id: 'routine-1',
                userId: 'user-1',
                name: 'Push Pull Legs',
                isActive: false,
                isPublic: false,
                likesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            const mockDay: RoutineDay = {
                id: 'day-1',
                routineId: 'routine-1',
                dayOfWeek: 1,
                dayName: 'Push Day',
                orderIndex: 0,
                createdAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(routineRepo.createRoutine).mockResolvedValue(mockRoutine)
            vi.mocked(routineRepo.createRoutineDay).mockResolvedValue(mockDay)

            const days = [
                {
                    dayOfWeek: 1,
                    dayName: 'Push Day',
                    orderIndex: 0,
                    exercises: [],
                },
            ]

            const result = await createRoutine(
                'user-1',
                'Push Pull Legs',
                days
            )

            expect(result).toEqual(mockRoutine)
            expect(routineRepo.createRoutine).toHaveBeenCalledWith(
                expect.anything(),
                {
                    userId: 'user-1',
                    name: 'Push Pull Legs',
                }
            )
        })

        it('should trim whitespace from routine name', async () => {
            const mockRoutine: Routine = {
                id: 'routine-1',
                userId: 'user-1',
                name: 'Push Pull Legs',
                isActive: false,
                isPublic: false,
                likesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            const mockDay: RoutineDay = {
                id: 'day-1',
                routineId: 'routine-1',
                dayOfWeek: 1,
                dayName: 'Push Day',
                orderIndex: 0,
                createdAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(routineRepo.createRoutine).mockResolvedValue(mockRoutine)
            vi.mocked(routineRepo.createRoutineDay).mockResolvedValue(mockDay)

            const days = [
                {
                    dayOfWeek: 1,
                    dayName: 'Push Day',
                    orderIndex: 0,
                    exercises: [],
                },
            ]

            await createRoutine('user-1', '  Push Pull Legs  ', days)

            expect(routineRepo.createRoutine).toHaveBeenCalledWith(
                expect.anything(),
                {
                    userId: 'user-1',
                    name: 'Push Pull Legs',
                }
            )
        })
    })

    describe('updateRoutine', () => {
        const mockRoutine: Routine = {
            id: 'routine-1',
            userId: 'user-1',
            name: 'Push Pull Legs',
            isActive: false,
            isPublic: false,
            likesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null)

            await expect(
                updateRoutine('non-existent', 'user-1', { name: 'New Name' })
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw AuthError if user is not the owner', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )

            await expect(
                updateRoutine('routine-1', 'user-2', { name: 'New Name' })
            ).rejects.toThrow(AuthError)
            await expect(
                updateRoutine('routine-1', 'user-2', { name: 'New Name' })
            ).rejects.toThrow('No tienes permiso')
        })

        it('should throw ValidationError if routine has sessions', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.countSessionsByRoutineId).mockResolvedValue(
                5
            )

            await expect(
                updateRoutine('routine-1', 'user-1', { name: 'New Name' })
            ).rejects.toThrow(ValidationError)
            await expect(
                updateRoutine('routine-1', 'user-1', { name: 'New Name' })
            ).rejects.toThrow('Solo puedes duplicarla')
        })

        it('should throw ValidationError if new name is empty', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.countSessionsByRoutineId).mockResolvedValue(
                0
            )

            await expect(
                updateRoutine('routine-1', 'user-1', { name: '' })
            ).rejects.toThrow(ValidationError)
        })

        it('should update routine with valid data', async () => {
            const updatedRoutine = { ...mockRoutine, name: 'Updated Name' }

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.countSessionsByRoutineId).mockResolvedValue(
                0
            )
            vi.mocked(routineRepo.updateRoutine).mockResolvedValue(
                updatedRoutine
            )

            const result = await updateRoutine('routine-1', 'user-1', {
                name: 'Updated Name',
            })

            expect(result.name).toBe('Updated Name')
        })
    })

    describe('activateRoutine', () => {
        const mockRoutine: Routine = {
            id: 'routine-1',
            userId: 'user-1',
            name: 'Push Pull Legs',
            isActive: false,
            isPublic: false,
            likesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null)

            await expect(
                activateRoutine('non-existent', 'user-1')
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw AuthError if user is not the owner', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )

            await expect(
                activateRoutine('routine-1', 'user-2')
            ).rejects.toThrow(AuthError)
        })

        it('should activate routine for owner', async () => {
            const activatedRoutine = { ...mockRoutine, isActive: true }

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.updateRoutine).mockResolvedValue(
                activatedRoutine
            )

            const result = await activateRoutine('routine-1', 'user-1')

            expect(result.isActive).toBe(true)
        })
    })

    describe('publishRoutine', () => {
        const mockRoutine: Routine = {
            id: 'routine-1',
            userId: 'user-1',
            name: 'Push Pull Legs',
            isActive: false,
            isPublic: false,
            likesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null)

            await expect(
                publishRoutine('non-existent', 'user-1')
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw AuthError if user is not the owner', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )

            await expect(publishRoutine('routine-1', 'user-2')).rejects.toThrow(
                AuthError
            )
        })

        it('should publish routine for owner', async () => {
            const publishedRoutine = { ...mockRoutine, isPublic: true }

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.updateRoutine).mockResolvedValue(
                publishedRoutine
            )

            const result = await publishRoutine('routine-1', 'user-1')

            expect(result.isPublic).toBe(true)
        })
    })

    describe('softDeleteRoutine', () => {
        const mockRoutine: Routine = {
            id: 'routine-1',
            userId: 'user-1',
            name: 'Push Pull Legs',
            isActive: false,
            isPublic: false,
            likesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null)

            await expect(
                softDeleteRoutine('non-existent', 'user-1')
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw AuthError if user is not the owner', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )

            await expect(
                softDeleteRoutine('routine-1', 'user-2')
            ).rejects.toThrow(AuthError)
        })

        it('should throw ValidationError if routine has sessions', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.countSessionsByRoutineId).mockResolvedValue(
                3
            )

            await expect(
                softDeleteRoutine('routine-1', 'user-1')
            ).rejects.toThrow(ValidationError)
        })

        it('should soft delete routine if no sessions', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockRoutine
            )
            vi.mocked(routineRepo.countSessionsByRoutineId).mockResolvedValue(
                0
            )
            vi.mocked(routineRepo.softDeleteRoutine).mockResolvedValue()

            await expect(
                softDeleteRoutine('routine-1', 'user-1')
            ).resolves.toBeUndefined()
            expect(routineRepo.softDeleteRoutine).toHaveBeenCalled()
        })
    })

    describe('likeRoutine', () => {
        const mockPublicRoutine: Routine = {
            id: 'routine-1',
            userId: 'user-1',
            name: 'Public Routine',
            isActive: true,
            isPublic: true,
            likesCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null)

            await expect(likeRoutine('user-2', 'non-existent')).rejects.toThrow(
                NotFoundError
            )
        })

        it('should throw ValidationError if routine is not public', async () => {
            const privateRoutine = { ...mockPublicRoutine, isPublic: false }

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                privateRoutine
            )

            await expect(likeRoutine('user-2', 'routine-1')).rejects.toThrow(
                ValidationError
            )
            await expect(likeRoutine('user-2', 'routine-1')).rejects.toThrow(
                'rutinas públicas'
            )
        })

        it('should create like if routine is public and not already liked', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockPublicRoutine
            )
            vi.mocked(routineRepo.findLike).mockResolvedValue(null)
            vi.mocked(routineRepo.createLike).mockResolvedValue()

            await expect(
                likeRoutine('user-2', 'routine-1')
            ).resolves.toBeUndefined()
            expect(routineRepo.createLike).toHaveBeenCalled()
        })

        it('should be idempotent if already liked', async () => {
            const mockLike: RoutineLike = {
                id: 'like-1',
                userId: 'user-2',
                routineId: 'routine-1',
                createdAt: '2024-01-01T00:00:00Z',
                deletedAt: null,
            }

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(
                mockPublicRoutine
            )
            vi.mocked(routineRepo.findLike).mockResolvedValue(mockLike)

            await expect(
                likeRoutine('user-2', 'routine-1')
            ).resolves.toBeUndefined()
            expect(routineRepo.createLike).not.toHaveBeenCalled()
        })
    })

    describe('unlikeRoutine', () => {
        it('should be idempotent if like does not exist', async () => {
            vi.mocked(routineRepo.findLike).mockResolvedValue(null)

            await expect(
                unlikeRoutine('user-2', 'routine-1')
            ).resolves.toBeUndefined()
            expect(routineRepo.deleteLike).not.toHaveBeenCalled()
        })

        it('should delete like if it exists', async () => {
            const mockLike: RoutineLike = {
                id: 'like-1',
                userId: 'user-2',
                routineId: 'routine-1',
                createdAt: '2024-01-01T00:00:00Z',
                deletedAt: null,
            }

            vi.mocked(routineRepo.findLike).mockResolvedValue(mockLike)
            vi.mocked(routineRepo.deleteLike).mockResolvedValue()

            await expect(
                unlikeRoutine('user-2', 'routine-1')
            ).resolves.toBeUndefined()
            expect(routineRepo.deleteLike).toHaveBeenCalled()
        })
    })
})
