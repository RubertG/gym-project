import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as workoutRepo from '@/lib/repositories/workoutRepository';
import * as routineRepo from '@/lib/repositories/routineRepository';
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors';
import type { WorkoutSession, WorkoutSet, Routine } from '@/lib/models';

// Mock dependencies
vi.mock('@/lib/db/client', () => ({
    getServerClient: vi.fn(() => ({})),
}));

vi.mock('@/lib/repositories/workoutRepository');
vi.mock('@/lib/repositories/routineRepository');

const {
    createSession,
    addSetsToSession,
    completeSession,
    getCalendarData,
    calculatePRs,
} = await import('./workoutService');

describe('workoutService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createSession', () => {
        it('should throw ValidationError for invalid date format', async () => {
            await expect(
                createSession('user-1', null, 'not-a-date')
            ).rejects.toThrow(ValidationError);
            await expect(
                createSession('user-1', null, 'not-a-date')
            ).rejects.toThrow('fecha de sesión no es válida');
        });

        it('should throw ValidationError for date without YYYY-MM-DD format', async () => {
            await expect(
                createSession('user-1', null, '2024/01/15')
            ).rejects.toThrow(ValidationError);
        });

        it('should throw ValidationError for invalid month/day', async () => {
            await expect(
                createSession('user-1', null, '2024-13-01')
            ).rejects.toThrow(ValidationError);
        });

        it('should throw NotFoundError if routine does not exist', async () => {
            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(null);

            await expect(
                createSession('user-1', 'non-existent', '2024-01-15')
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw AuthError if routine is not public and not owned by user', async () => {
            const routine: Routine = {
                id: 'routine-1',
                userId: 'user-2',
                name: 'Other Routine',
                isActive: true,
                isPublic: false,
                likesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(routine);

            await expect(
                createSession('user-1', 'routine-1', '2024-01-15')
            ).rejects.toThrow(AuthError);
        });

        it('should create session with valid date and no routine', async () => {
            const mockSession: WorkoutSession = {
                id: 'session-1',
                userId: 'user-1',
                routineId: null,
                routineDayId: null,
                sessionDate: '2024-01-15',
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(workoutRepo.createSession).mockResolvedValue(mockSession);

            const result = await createSession('user-1', null, '2024-01-15');

            expect(result.sessionDate).toBe('2024-01-15');
            expect(workoutRepo.createSession).toHaveBeenCalledWith(
                expect.anything(),
                {
                    userId: 'user-1',
                    routineId: null,
                    routineDayId: null,
                    sessionDate: '2024-01-15',
                }
            );
        });

        it('should create session with valid routine owned by user', async () => {
            const routine: Routine = {
                id: 'routine-1',
                userId: 'user-1',
                name: 'My Routine',
                isActive: true,
                isPublic: false,
                likesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const mockSession: WorkoutSession = {
                id: 'session-1',
                userId: 'user-1',
                routineId: 'routine-1',
                routineDayId: null,
                sessionDate: '2024-01-15',
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(routine);
            vi.mocked(workoutRepo.createSession).mockResolvedValue(mockSession);

            const result = await createSession(
                'user-1',
                'routine-1',
                '2024-01-15'
            );

            expect(result.routineId).toBe('routine-1');
        });

        it('should create session with public routine not owned by user', async () => {
            const routine: Routine = {
                id: 'routine-1',
                userId: 'user-2',
                name: 'Public Routine',
                isActive: true,
                isPublic: true,
                likesCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            const mockSession: WorkoutSession = {
                id: 'session-1',
                userId: 'user-1',
                routineId: 'routine-1',
                routineDayId: null,
                sessionDate: '2024-01-15',
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            vi.mocked(routineRepo.findRoutineById).mockResolvedValue(routine);
            vi.mocked(workoutRepo.createSession).mockResolvedValue(mockSession);

            const result = await createSession(
                'user-1',
                'routine-1',
                '2024-01-15'
            );

            expect(result.routineId).toBe('routine-1');
        });
    });

    describe('addSetsToSession', () => {
        const mockSession: WorkoutSession = {
            id: 'session-1',
            userId: 'user-1',
            routineId: 'routine-1',
            routineDayId: null,
            sessionDate: '2024-01-15',
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        it('should throw NotFoundError if session does not exist', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(null);

            await expect(
                addSetsToSession('non-existent', 'ex-1', [
                    { reps: 10, weightKg: 50 },
                ])
            ).rejects.toThrow(NotFoundError);
        });

        it('should throw ValidationError if session is not in draft status', async () => {
            const completedSession = {
                ...mockSession,
                status: 'completed' as const,
            };

            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                completedSession
            );

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: 50 },
                ])
            ).rejects.toThrow(ValidationError);
            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: 50 },
                ])
            ).rejects.toThrow('estado borrador');
        });

        it('should throw ValidationError if sets array is empty', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );

            await expect(
                addSetsToSession('session-1', 'ex-1', [])
            ).rejects.toThrow(ValidationError);
            await expect(
                addSetsToSession('session-1', 'ex-1', [])
            ).rejects.toThrow('al menos una serie');
        });

        it('should throw ValidationError if reps is zero or negative', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 0, weightKg: 50 },
                ])
            ).rejects.toThrow(ValidationError);
            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 0, weightKg: 50 },
                ])
            ).rejects.toThrow('repeticiones deben ser mayores');

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: -5, weightKg: 50 },
                ])
            ).rejects.toThrow(ValidationError);
        });

        it('should throw ValidationError if weight is negative', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: -10 },
                ])
            ).rejects.toThrow(ValidationError);
            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: -10 },
                ])
            ).rejects.toThrow('peso no puede ser negativo');
        });

        it('should allow zero weight (bodyweight exercises)', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );
            vi.mocked(workoutRepo.createWorkoutSets).mockResolvedValue([]);

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: 0 },
                ])
            ).resolves.toBeDefined();
        });

        it('should create sets with valid data', async () => {
            const mockSets: WorkoutSet[] = [
                {
                    id: 'set-1',
                    workoutSessionId: 'session-1',
                    exerciseId: 'ex-1',
                    reps: 10,
                    weightKg: 50,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
            ];

            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );
            vi.mocked(workoutRepo.createWorkoutSets).mockResolvedValue(
                mockSets
            );

            const result = await addSetsToSession('session-1', 'ex-1', [
                { reps: 10, weightKg: 50 },
            ]);

            expect(result).toEqual(mockSets);
            expect(workoutRepo.createWorkoutSets).toHaveBeenCalledWith(
                expect.anything(),
                {
                    workoutSessionId: 'session-1',
                    exerciseId: 'ex-1',
                    sets: [{ reps: 10, weightKg: 50 }],
                }
            );
        });

        it('should validate all sets in batch', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );

            await expect(
                addSetsToSession('session-1', 'ex-1', [
                    { reps: 10, weightKg: 50 },
                    { reps: 0, weightKg: 60 }, // invalid
                ])
            ).rejects.toThrow(ValidationError);
        });
    });

    describe('completeSession', () => {
        const mockSession: WorkoutSession = {
            id: 'session-1',
            userId: 'user-1',
            routineId: 'routine-1',
            routineDayId: null,
            sessionDate: '2024-01-15',
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        };

        it('should throw NotFoundError if session does not exist', async () => {
            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(null);

            await expect(completeSession('non-existent')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should throw ValidationError if session is already completed', async () => {
            const completedSession = {
                ...mockSession,
                status: 'completed' as const,
            };

            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                completedSession
            );

            await expect(completeSession('session-1')).rejects.toThrow(
                ValidationError
            );
            await expect(completeSession('session-1')).rejects.toThrow(
                'ya fue completada'
            );
        });

        it('should complete session if in draft status', async () => {
            const completedSession = {
                ...mockSession,
                status: 'completed' as const,
            };

            vi.mocked(workoutRepo.findSessionById).mockResolvedValue(
                mockSession
            );
            vi.mocked(workoutRepo.completeSession).mockResolvedValue(
                completedSession
            );

            const result = await completeSession('session-1');

            expect(result.status).toBe('completed');
        });
    });

    describe('getCalendarData', () => {
        it('should throw ValidationError for invalid month (< 1)', async () => {
            await expect(getCalendarData('user-1', 2024, 0)).rejects.toThrow(
                ValidationError
            );
        });

        it('should throw ValidationError for invalid month (> 12)', async () => {
            await expect(getCalendarData('user-1', 2024, 13)).rejects.toThrow(
                ValidationError
            );
        });

        it('should return calendar data for valid month', async () => {
            const mockSessions: WorkoutSession[] = [
                {
                    id: 'session-1',
                    userId: 'user-1',
                    routineId: 'routine-1',
                    routineDayId: null,
                    sessionDate: '2024-01-15',
                    status: 'completed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
            ];

            vi.mocked(workoutRepo.findSessionsInDateRange).mockResolvedValue(
                mockSessions
            );

            const result = await getCalendarData('user-1', 2024, 1);

            expect(result).toHaveLength(31); // January has 31 days
            const completedDay = result.find((d) => d.date === '2024-01-15');

            expect(completedDay?.status).toBe('completed');

            const restDay = result.find((d) => d.date === '2024-01-16');

            expect(restDay?.status).toBe('rest');
        });

        it('should handle February in leap year', async () => {
            vi.mocked(workoutRepo.findSessionsInDateRange).mockResolvedValue(
                []
            );

            const result = await getCalendarData('user-1', 2024, 2);

            expect(result).toHaveLength(29); // 2024 is a leap year
        });

        it('should handle February in non-leap year', async () => {
            vi.mocked(workoutRepo.findSessionsInDateRange).mockResolvedValue(
                []
            );

            const result = await getCalendarData('user-1', 2023, 2);

            expect(result).toHaveLength(28);
        });
    });

    describe('calculatePRs', () => {
        it('should return zeros if no sets found', async () => {
            vi.mocked(workoutRepo.findSetsByUserAndExercise).mockResolvedValue(
                []
            );

            const result = await calculatePRs('user-1', 'ex-1');

            expect(result.maxWeight).toBe(0);
            expect(result.maxVolume).toBe(0);
            expect(result.bestSet).toBeNull();
        });

        it('should calculate max weight correctly', async () => {
            const sets: WorkoutSet[] = [
                {
                    id: 'set-1',
                    workoutSessionId: 'session-1',
                    exerciseId: 'ex-1',
                    reps: 10,
                    weightKg: 50,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                {
                    id: 'set-2',
                    workoutSessionId: 'session-2',
                    exerciseId: 'ex-1',
                    reps: 5,
                    weightKg: 80,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                {
                    id: 'set-3',
                    workoutSessionId: 'session-3',
                    exerciseId: 'ex-1',
                    reps: 3,
                    weightKg: 100,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
            ];

            vi.mocked(workoutRepo.findSetsByUserAndExercise).mockResolvedValue(
                sets
            );

            const result = await calculatePRs('user-1', 'ex-1');

            expect(result.maxWeight).toBe(100);
        });

        it('should calculate max volume correctly', async () => {
            const sets: WorkoutSet[] = [
                {
                    id: 'set-1',
                    workoutSessionId: 'session-1',
                    exerciseId: 'ex-1',
                    reps: 10,
                    weightKg: 50,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                {
                    id: 'set-2',
                    workoutSessionId: 'session-2',
                    exerciseId: 'ex-1',
                    reps: 5,
                    weightKg: 80,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                {
                    id: 'set-3',
                    workoutSessionId: 'session-3',
                    exerciseId: 'ex-1',
                    reps: 3,
                    weightKg: 100,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
            ];

            vi.mocked(workoutRepo.findSetsByUserAndExercise).mockResolvedValue(
                sets
            );

            const result = await calculatePRs('user-1', 'ex-1');

            // Volume: 10*50=500, 5*80=400, 3*100=300
            expect(result.maxVolume).toBe(500);
        });

        it('should identify best set by volume', async () => {
            const sets: WorkoutSet[] = [
                {
                    id: 'set-1',
                    workoutSessionId: 'session-1',
                    exerciseId: 'ex-1',
                    reps: 10,
                    weightKg: 50,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
                {
                    id: 'set-2',
                    workoutSessionId: 'session-2',
                    exerciseId: 'ex-1',
                    reps: 8,
                    weightKg: 70,
                    note: null,
                    createdAt: new Date(),
                    deletedAt: null,
                },
            ];

            vi.mocked(workoutRepo.findSetsByUserAndExercise).mockResolvedValue(
                sets
            );

            const result = await calculatePRs('user-1', 'ex-1');

            // Volume: 10*50=500, 8*70=560
            expect(result.bestSet).toEqual({
                reps: 8,
                weightKg: 70,
                volume: 560,
            });
        });
    });
});
