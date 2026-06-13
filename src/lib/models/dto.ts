import type { RoutineDay, RoutineExercise } from './index';

/*
 * DTOs para payloads de creación/actualización en services.
 */

export interface RoutineDayInput extends Omit<RoutineDay, 'id' | 'routineId'> {
    exercises: Omit<RoutineExercise, 'id' | 'routineDayId'>[];
}

export interface WorkoutSetInput {
    setNumber: number;
    reps: number;
    weightKg: number;
    note: string | null;
}

export interface CreateRoutinePayload {
    userId: string;
    name: string;
    isPublic?: boolean;
    days: RoutineDayInput[];
}

export interface CreateSessionPayload {
    userId: string;
    routineId: string | null;
    routineDayId: string | null;
    sessionDate: string;
    note?: string | null;
}
