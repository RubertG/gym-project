/*
 * Repository: routines
 * Responsabilidad: acceso a datos de routines, routine_days, routine_exercises y routine_likes.
 */

import type { DbClient } from '@/lib/db/types'
import type {
    Routine,
    RoutineDay,
    RoutineExercise,
    RoutineLike,
} from '@/lib/models'
import { AppError, NotFoundError } from '@/lib/utils/errors'

/* ─────────── routines ─────────── */

export async function findRoutinesByUser(
    db: DbClient,
    userId: string
): Promise<Routine[]> {
    const { data, error } = await db
        .from<Routine>('routines')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function findPublicRoutines(db: DbClient): Promise<Routine[]> {
    const { data, error } = await db
        .from<Routine>('routines')
        .select('*')
        .eq('is_public', true)
        .is('deleted_at', null)
        .order('likes_count', { ascending: false })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function findRoutineById(
    db: DbClient,
    id: string
): Promise<Routine | null> {
    const { data, error } = await db
        .from<Routine>('routines')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function createRoutine(
    db: DbClient,
    payload: { userId: string; name: string; isPublic?: boolean }
): Promise<Routine> {
    const { data, error } = await db
        .from<Routine>('routines')
        .insert({
            user_id: payload.userId,
            name: payload.name,
            is_public: payload.isPublic ?? false,
        })
        .select()
        .single()

    if (error || !data)
        throw new AppError(error?.message ?? 'Error al crear rutina', 500)
    return data
}

export async function updateRoutine(
    db: DbClient,
    id: string,
    payload: Partial<Pick<Routine, 'name' | 'isActive' | 'isPublic'>>
): Promise<Routine> {
    const mapped: Record<string, unknown> = {}

    if (payload.name !== undefined) mapped.name = payload.name
    if (payload.isActive !== undefined) mapped.is_active = payload.isActive
    if (payload.isPublic !== undefined) mapped.is_public = payload.isPublic

    const { data, error } = await db
        .from<Routine>('routines')
        .update(mapped)
        .eq('id', id)
        .select()
        .single()

    if (error || !data) throw new NotFoundError('Rutina')
    return data
}

export async function softDeleteRoutine(
    db: DbClient,
    id: string
): Promise<void> {
    const { error } = await db
        .from<Routine>('routines')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new AppError(error.message, 500)
}

/* ─────────── routine_days ─────────── */

export async function findDaysByRoutineId(
    db: DbClient,
    routineId: string
): Promise<RoutineDay[]> {
    const { data, error } = await db
        .from<RoutineDay>('routine_days')
        .select('*')
        .eq('routine_id', routineId)
        .is('deleted_at', null)
        .order('order_index', { ascending: true })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function createRoutineDay(
    db: DbClient,
    payload: Omit<RoutineDay, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
): Promise<RoutineDay> {
    const { data, error } = await db
        .from<RoutineDay>('routine_days')
        .insert({
            routine_id: payload.routineId,
            day_of_week: payload.dayOfWeek,
            day_name: payload.dayName,
            order_index: payload.orderIndex,
        })
        .select()
        .single()

    if (error || !data)
        throw new AppError(
            error?.message ?? 'Error al crear día de rutina',
            500
        )
    return data
}

export async function updateRoutineDay(
    db: DbClient,
    id: string,
    payload: Partial<Pick<RoutineDay, 'dayOfWeek' | 'dayName' | 'orderIndex'>>
): Promise<RoutineDay> {
    const mapped: Record<string, unknown> = {}

    if (payload.dayOfWeek !== undefined) mapped.day_of_week = payload.dayOfWeek
    if (payload.dayName !== undefined) mapped.day_name = payload.dayName
    if (payload.orderIndex !== undefined)
        mapped.order_index = payload.orderIndex

    const { data, error } = await db
        .from<RoutineDay>('routine_days')
        .update(mapped)
        .eq('id', id)
        .select()
        .single()

    if (error || !data) throw new NotFoundError('RoutineDay')
    return data
}

export async function deleteDaysByRoutineId(
    db: DbClient,
    routineId: string
): Promise<void> {
    const { error } = await db
        .from('routine_days')
        .delete()
        .eq('routine_id', routineId)

    if (error) throw new AppError(error.message, 500)
}

/* ─────────── routine_exercises ─────────── */

export async function findExercisesByDayId(
    db: DbClient,
    routineDayId: string
): Promise<RoutineExercise[]> {
    const { data, error } = await db
        .from<RoutineExercise>('routine_exercises')
        .select('*')
        .eq('routine_day_id', routineDayId)
        .is('deleted_at', null)
        .order('order_index', { ascending: true })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function createRoutineExercise(
    db: DbClient,
    payload: Omit<
        RoutineExercise,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >
): Promise<RoutineExercise> {
    const { data, error } = await db
        .from<RoutineExercise>('routine_exercises')
        .insert({
            routine_day_id: payload.routineDayId,
            exercise_id: payload.exerciseId,
            order_index: payload.orderIndex,
            suggested_sets: payload.suggestedSets,
            suggested_reps: payload.suggestedReps,
            notes: payload.notes,
        })
        .select()
        .single()

    if (error || !data)
        throw new AppError(
            error?.message ?? 'Error al crear ejercicio de rutina',
            500
        )
    return data
}

export async function updateRoutineExercise(
    db: DbClient,
    id: string,
    payload: Partial<
        Pick<
            RoutineExercise,
            'orderIndex' | 'suggestedSets' | 'suggestedReps' | 'notes'
        >
    >
): Promise<RoutineExercise> {
    const mapped: Record<string, unknown> = {}

    if (payload.orderIndex !== undefined)
        mapped.order_index = payload.orderIndex
    if (payload.suggestedSets !== undefined)
        mapped.suggested_sets = payload.suggestedSets
    if (payload.suggestedReps !== undefined)
        mapped.suggested_reps = payload.suggestedReps
    if (payload.notes !== undefined) mapped.notes = payload.notes

    const { data, error } = await db
        .from<RoutineExercise>('routine_exercises')
        .update(mapped)
        .eq('id', id)
        .select()
        .single()

    if (error || !data) throw new NotFoundError('RoutineExercise')
    return data
}

export async function deleteExercisesByDayId(
    db: DbClient,
    routineDayId: string
): Promise<void> {
    const { error } = await db
        .from('routine_exercises')
        .delete()
        .eq('routine_day_id', routineDayId)

    if (error) throw new AppError(error.message, 500)
}

/* ─────────── routine_likes ─────────── */

export async function findLikesByRoutineId(
    db: DbClient,
    routineId: string
): Promise<RoutineLike[]> {
    const { data, error } = await db
        .from<RoutineLike>('routine_likes')
        .select('*')
        .eq('routine_id', routineId)
        .order('created_at', { ascending: false })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function findLike(
    db: DbClient,
    userId: string,
    routineId: string
): Promise<RoutineLike | null> {
    const { data, error } = await db
        .from<RoutineLike>('routine_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('routine_id', routineId)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function createLike(
    db: DbClient,
    userId: string,
    routineId: string
): Promise<void> {
    const { error } = await db
        .from('routine_likes')
        .insert({ user_id: userId, routine_id: routineId })

    if (error) throw new AppError(error.message, 500)
}

export async function deleteLike(
    db: DbClient,
    userId: string,
    routineId: string
): Promise<void> {
    const { error } = await db
        .from('routine_likes')
        .delete()
        .eq('user_id', userId)
        .eq('routine_id', routineId)

    if (error) throw new AppError(error.message, 500)
}

/* ─────────── misc ─────────── */

export async function countSessionsByRoutineId(
    db: DbClient,
    routineId: string
): Promise<number> {
    const builder = db
        .from('workout_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('routine_id', routineId)
        .is('deleted_at', null)

    const { error } = await builder
    const count = (builder as unknown as { count: number | null }).count

    if (error) throw new AppError(error.message, 500)
    return count ?? 0
}
