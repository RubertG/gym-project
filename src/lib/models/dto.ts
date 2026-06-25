import type { RoutineDay, RoutineExercise } from './index'

/*
 * DTOs para payloads de creación/actualización en services.
 */

export interface RoutineDayInput extends Omit<
    RoutineDay,
    'id' | 'routineId' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
    exercises: Omit<
        RoutineExercise,
        'id' | 'routineDayId' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >[]
}

export interface WorkoutSetInput {
    setNumber: number
    reps: number
    weightKg: number
    note: string | null
}

export interface ExerciseMediaInput {
    type: 'image' | 'video'
    url?: string
    thumbnailUrl?: string | null
    orderIndex?: number
}

export interface CreateExercisePayload {
    name: string
    category?: string | null
    media?: ExerciseMediaInput[]
}

export interface UpdateProfilePayload {
    username?: string
    avatarUrl?: string | null
}
