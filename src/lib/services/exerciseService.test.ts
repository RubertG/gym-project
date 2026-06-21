import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as exerciseRepo from '@/lib/repositories/exerciseRepository'
import * as profileRepo from '@/lib/repositories/profileRepository'
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors'
import type { Exercise, Profile } from '@/lib/models'

// Mock dependencies
vi.mock('@/lib/db/client', () => ({
    getServerClient: vi.fn(() => ({})),
}))

vi.mock('@/lib/repositories/exerciseRepository')
vi.mock('@/lib/repositories/profileRepository')

const { proposeExercise, approveExercise, searchExercises } =
    await import('./exerciseService')

describe('exerciseService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('proposeExercise', () => {
        it('should throw ValidationError if name is empty', async () => {
            await expect(proposeExercise('user-1', '')).rejects.toThrow(
                ValidationError
            )
            await expect(proposeExercise('user-1', '')).rejects.toThrow(
                'nombre del ejercicio es obligatorio'
            )
        })

        it('should throw ValidationError if name is only whitespace', async () => {
            await expect(proposeExercise('user-1', '   ')).rejects.toThrow(
                ValidationError
            )
        })

        it('should throw ValidationError if exercise name already exists', async () => {
            const existingExercise: Exercise = {
                id: 'ex-1',
                name: 'Bench Press',
                category: 'chest',
                muscleGroup: 'pectorals',
                status: 'approved',
                imageUrl: null,
                createdBy: 'admin-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(exerciseRepo.findExerciseByNameLower).mockResolvedValue(
                existingExercise
            )

            await expect(
                proposeExercise('user-1', 'Bench Press')
            ).rejects.toThrow(ValidationError)
            await expect(
                proposeExercise('user-1', 'Bench Press')
            ).rejects.toThrow('Ya existe un ejercicio')
        })

        it('should create exercise with pending status', async () => {
            const newExercise: Exercise = {
                id: 'ex-new',
                name: 'New Exercise',
                category: 'legs',
                muscleGroup: 'quadriceps',
                status: 'pending',
                imageUrl: null,
                createdBy: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(exerciseRepo.findExerciseByNameLower).mockResolvedValue(
                null
            )
            vi.mocked(exerciseRepo.createExercise).mockResolvedValue(
                newExercise
            )

            const result = await proposeExercise('user-1', 'New Exercise')

            expect(result.status).toBe('pending')
            expect(result.createdBy).toBe('user-1')
            expect(exerciseRepo.createExercise).toHaveBeenCalledWith(
                expect.anything(),
                {
                    name: 'New Exercise',
                    imageUrl: undefined,
                    createdBy: 'user-1',
                    status: 'pending',
                }
            )
        })

        it('should trim exercise name before saving', async () => {
            const newExercise: Exercise = {
                id: 'ex-new',
                name: 'New Exercise',
                category: 'legs',
                muscleGroup: 'quadriceps',
                status: 'pending',
                imageUrl: null,
                createdBy: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(exerciseRepo.findExerciseByNameLower).mockResolvedValue(
                null
            )
            vi.mocked(exerciseRepo.createExercise).mockResolvedValue(
                newExercise
            )

            await proposeExercise('user-1', '  New Exercise  ')

            expect(exerciseRepo.createExercise).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ name: 'New Exercise' })
            )
        })
    })

    describe('approveExercise', () => {
        const mockExercise: Exercise = {
            id: 'ex-1',
            name: 'Pending Exercise',
            category: 'chest',
            muscleGroup: 'pectorals',
            status: 'pending',
            imageUrl: null,
            createdBy: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        }

        it('should throw NotFoundError if exercise does not exist', async () => {
            vi.mocked(exerciseRepo.findExerciseById).mockResolvedValue(null)

            await expect(
                approveExercise('non-existent', 'admin-1')
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw AuthError if user is not admin', async () => {
            vi.mocked(exerciseRepo.findExerciseById).mockResolvedValue(
                mockExercise
            )
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(null)

            await expect(approveExercise('ex-1', 'not-admin')).rejects.toThrow(
                AuthError
            )
            await expect(approveExercise('ex-1', 'not-admin')).rejects.toThrow(
                'administradores'
            )
        })

        it('should throw AuthError if user role is not admin', async () => {
            const regularProfile: Profile = {
                id: 'profile-1',
                userId: 'user-1',
                username: 'regular',
                role: 'user',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            vi.mocked(exerciseRepo.findExerciseById).mockResolvedValue(
                mockExercise
            )
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                regularProfile
            )

            await expect(approveExercise('ex-1', 'user-1')).rejects.toThrow(
                AuthError
            )
        })

        it('should approve exercise if user is admin', async () => {
            const adminProfile: Profile = {
                id: 'admin-1',
                userId: 'admin-1',
                username: 'admin',
                role: 'admin',
                avatarUrl: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }

            const approvedExercise = {
                ...mockExercise,
                status: 'approved' as const,
            }

            vi.mocked(exerciseRepo.findExerciseById).mockResolvedValue(
                mockExercise
            )
            vi.mocked(profileRepo.findProfileByUserId).mockResolvedValue(
                adminProfile
            )
            vi.mocked(exerciseRepo.updateExercise).mockResolvedValue(
                approvedExercise
            )

            const result = await approveExercise('ex-1', 'admin-1')

            expect(result.status).toBe('approved')
            expect(exerciseRepo.updateExercise).toHaveBeenCalledWith(
                expect.anything(),
                'ex-1',
                { status: 'approved' }
            )
        })
    })

    describe('searchExercises', () => {
        it('should return all approved exercises if query is empty', async () => {
            const exercises: Exercise[] = [
                {
                    id: 'ex-1',
                    name: 'Bench Press',
                    category: 'chest',
                    muscleGroup: 'pectorals',
                    status: 'approved',
                    imageUrl: null,
                    createdBy: 'admin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ]

            vi.mocked(exerciseRepo.findAllApprovedExercises).mockResolvedValue(
                exercises
            )

            const result = await searchExercises('')

            expect(result).toEqual(exercises)
            expect(exerciseRepo.findAllApprovedExercises).toHaveBeenCalled()
            expect(exerciseRepo.searchExercisesByName).not.toHaveBeenCalled()
        })

        it('should return all approved exercises if query is only whitespace', async () => {
            vi.mocked(exerciseRepo.findAllApprovedExercises).mockResolvedValue(
                []
            )

            await searchExercises('   ')

            expect(exerciseRepo.findAllApprovedExercises).toHaveBeenCalled()
        })

        it('should search by name if query has content', async () => {
            const results: Exercise[] = [
                {
                    id: 'ex-1',
                    name: 'Bench Press',
                    category: 'chest',
                    muscleGroup: 'pectorals',
                    status: 'approved',
                    imageUrl: null,
                    createdBy: 'admin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ]

            vi.mocked(exerciseRepo.searchExercisesByName).mockResolvedValue(
                results
            )

            const response = await searchExercises('bench')

            expect(response).toEqual(results)
            expect(exerciseRepo.searchExercisesByName).toHaveBeenCalledWith(
                expect.anything(),
                'bench'
            )
        })
    })
})
