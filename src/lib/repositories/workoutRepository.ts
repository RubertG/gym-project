/*
 * Repository: workout_sessions, workout_sets, user_active_routine_log
 * Responsabilidad: acceso a datos de entrenamientos.
 */

import type { DbClient } from '@/lib/db/types';
import type { UserActiveRoutineLog, WorkoutSession, WorkoutSet } from '@/lib/models';

/* ─────────── workout_sessions ─────────── */

export async function findSessionsByUser(
    db: DbClient,
    userId: string,
): Promise<WorkoutSession[]> {
    const { data, error } = await db
        .from<WorkoutSession>('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('session_date', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function findSessionById(
    db: DbClient,
    id: string,
): Promise<WorkoutSession | null> {
    const { data, error } = await db
        .from<WorkoutSession>('workout_sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}

export async function createSession(
    db: DbClient,
    payload: {
        userId: string;
        routineId: string | null;
        routineDayId: string | null;
        sessionDate: string;
        note?: string | null;
    },
): Promise<WorkoutSession> {
    const { data, error } = await db
        .from<WorkoutSession>('workout_sessions')
        .insert({
            user_id: payload.userId,
            routine_id: payload.routineId,
            routine_day_id: payload.routineDayId,
            session_date: payload.sessionDate,
            note: payload.note ?? null,
            status: 'draft',
        })
        .select()
        .single();

    if (error || !data) throw new Error(error?.message ?? 'Error al crear sesión');
    return data;
}

export async function completeSession(db: DbClient, id: string): Promise<WorkoutSession> {
    const { data, error } = await db
        .from<WorkoutSession>('workout_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error || !data) throw new Error(error?.message ?? 'Error al completar sesión');
    return data;
}

export async function softDeleteSession(db: DbClient, id: string): Promise<void> {
    const { error } = await db
        .from<WorkoutSession>('workout_sessions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(error.message);
}

/* ─────────── workout_sets ─────────── */

export async function findSetsBySessionId(
    db: DbClient,
    sessionId: string,
): Promise<WorkoutSet[]> {
    const { data, error } = await db
        .from<WorkoutSet>('workout_sets')
        .select('*')
        .eq('workout_session_id', sessionId)
        .is('deleted_at', null)
        .order('set_number', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function findSetsByExerciseId(
    db: DbClient,
    exerciseId: string,
): Promise<WorkoutSet[]> {
    const { data, error } = await db
        .from<WorkoutSet>('workout_sets')
        .select('*')
        .eq('exercise_id', exerciseId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function createWorkoutSets(
    db: DbClient,
    payload: {
        workoutSessionId: string;
        exerciseId: string;
        sets: Pick<WorkoutSet, 'setNumber' | 'reps' | 'weightKg' | 'note'>[];
    },
): Promise<WorkoutSet[]> {
    const rows = payload.sets.map((s) => ({
        workout_session_id: payload.workoutSessionId,
        exercise_id: payload.exerciseId,
        set_number: s.setNumber,
        reps: s.reps,
        weight_kg: s.weightKg,
        note: s.note ?? null,
    }));

    const { data, error } = await db
        .from<WorkoutSet>('workout_sets')
        .insert(rows as unknown[])
        .select();

    if (error || !data) throw new Error(error?.message ?? 'Error al insertar series');
    return data;
}

/* ─────────── historial / calendario ─────────── */

export async function findSessionsInDateRange(
    db: DbClient,
    userId: string,
    startDate: string,
    endDate: string,
): Promise<WorkoutSession[]> {
    const { data, error } = await db
        .from<WorkoutSession>('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('session_date', startDate)
        .lte('session_date', endDate)
        .is('deleted_at', null)
        .order('session_date', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function findSetsByUserAndExercise(
    db: DbClient,
    userId: string,
    exerciseId: string,
): Promise<(WorkoutSet & { session_date: string })[]> {
    const { data, error } = await db
        .from<WorkoutSet & { session_date: string }>('workout_sets')
        .select('*, workout_sessions!inner(session_date)')
        .eq('exercise_id', exerciseId)
        .eq('workout_sessions.user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
}

/* ─────────── user_active_routine_log ─────────── */

export async function findActiveRoutineLog(
    db: DbClient,
    userId: string,
): Promise<UserActiveRoutineLog | null> {
    const { data, error } = await db
        .from<UserActiveRoutineLog>('user_active_routine_log')
        .select('*')
        .eq('user_id', userId)
        .is('deactivated_at', null)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}
