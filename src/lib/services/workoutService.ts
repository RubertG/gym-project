/*
 * Service: workout sessions / sets
 * Lógica de negocio para registro de entrenamientos, historial y PRs.
 */

import { getServerClient } from '@/lib/db/client'
import * as workoutRepo from '@/lib/repositories/workoutRepository'
import * as routineRepo from '@/lib/repositories/routineRepository'
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors'
import type { WorkoutSession, WorkoutSet } from '@/lib/models'
import type { WorkoutSetInput } from '@/lib/models/dto'

/* ─────────── helpers ─────────── */

function isValidDate(dateStr: string): boolean {
    const d = new Date(dateStr)

    return !isNaN(d.getTime()) && /\d{4}-\d{2}-\d{2}/.test(dateStr)
}

/* ─────────── sesiones ─────────── */

export async function getSessionsByUser(
    userId: string
): Promise<WorkoutSession[]> {
    const db = getServerClient()

    return workoutRepo.findSessionsByUser(db, userId)
}

export async function getSessionById(
    id: string
): Promise<{ session: WorkoutSession; sets: WorkoutSet[] } | null> {
    const db = getServerClient()
    const session = await workoutRepo.findSessionById(db, id)

    if (!session) return null

    const sets = await workoutRepo.findSetsBySessionId(db, id)

    return { session, sets }
}

export async function createSession(
    userId: string,
    routineId: string | null,
    sessionDate: string
): Promise<WorkoutSession> {
    const db = getServerClient()

    if (!isValidDate(sessionDate)) {
        throw new ValidationError(
            'La fecha de sesión no es válida (YYYY-MM-DD)'
        )
    }

    const routineDayId: string | null = null

    if (routineId) {
        const routine = await routineRepo.findRoutineById(db, routineId)

        if (!routine) throw new NotFoundError('Rutina')
        if (routine.userId !== userId && !routine.isPublic) {
            throw new AuthError('No tienes acceso a esta rutina')
        }
        // Se permite null en routineDayId al crear sesión; se asigna luego si es necesario.
    }

    return workoutRepo.createSession(db, {
        userId,
        routineId,
        routineDayId,
        sessionDate,
    })
}

/* ─────────── sets (batch) ─────────── */

export async function addSetsToSession(
    sessionId: string,
    exerciseId: string,
    sets: WorkoutSetInput[]
): Promise<WorkoutSet[]> {
    const db = getServerClient()

    const session = await workoutRepo.findSessionById(db, sessionId)

    if (!session) throw new NotFoundError('Sesión')
    if (session.status !== 'draft') {
        throw new ValidationError(
            'Solo se pueden agregar series a sesiones en estado borrador'
        )
    }

    if (!sets || sets.length === 0) {
        throw new ValidationError('Debes enviar al menos una serie')
    }

    for (const s of sets) {
        if (s.reps <= 0) {
            throw new ValidationError(
                'Las repeticiones deben ser mayores a cero'
            )
        }
        if (s.weightKg < 0) {
            throw new ValidationError('El peso no puede ser negativo')
        }
    }

    return workoutRepo.createWorkoutSets(db, {
        workoutSessionId: sessionId,
        exerciseId,
        sets,
    })
}

/* ─────────── completar sesión ─────────── */

export async function completeSession(
    sessionId: string
): Promise<WorkoutSession> {
    const db = getServerClient()

    const session = await workoutRepo.findSessionById(db, sessionId)

    if (!session) throw new NotFoundError('Sesión')
    if (session.status !== 'draft') {
        throw new ValidationError('La sesión ya fue completada')
    }

    return workoutRepo.completeSession(db, sessionId)
}

/* ─────────── historial por ejercicio ─────────── */

export async function getExerciseHistory(
    userId: string,
    exerciseId: string
): Promise<(WorkoutSet & { session_date: string })[]> {
    const db = getServerClient()

    return workoutRepo.findSetsByUserAndExercise(db, userId, exerciseId)
}

/* ─────────── calendario ─────────── */

export async function getCalendarData(
    userId: string,
    year: number,
    month: number
): Promise<{ date: string; status: 'completed' | 'rest' | 'missed' }[]> {
    const db = getServerClient()

    if (month < 1 || month > 12) {
        throw new ValidationError('Mes inválido')
    }

    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`

    const sessions = await workoutRepo.findSessionsInDateRange(
        db,
        userId,
        start,
        end
    )
    const completedDates = new Set(sessions.map((s) => s.sessionDate))

    const result: { date: string; status: 'completed' | 'rest' | 'missed' }[] =
        []

    for (let d = 1; d <= new Date(year, month, 0).getDate(); d++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`

        if (completedDates.has(dateStr)) {
            result.push({ date: dateStr, status: 'completed' })
        } else {
            // Por ahora sin rutina activa en el servicio: se marcan como rest (se enriquecerá en controller con activeRoutineLog)
            result.push({ date: dateStr, status: 'rest' })
        }
    }

    return result
}

/* ─────────── PRs ─────────── */

export async function calculatePRs(
    userId: string,
    exerciseId: string
): Promise<{
    maxWeight: number
    maxVolume: number
    bestSet: { reps: number; weightKg: number; volume: number } | null
}> {
    const db = getServerClient()
    const sets = await workoutRepo.findSetsByUserAndExercise(
        db,
        userId,
        exerciseId
    )

    if (sets.length === 0) {
        return { maxWeight: 0, maxVolume: 0, bestSet: null }
    }

    let maxWeight = 0
    let maxVolume = 0
    let bestSet: { reps: number; weightKg: number; volume: number } | null =
        null

    for (const s of sets) {
        const volume = s.reps * s.weightKg

        if (s.weightKg > maxWeight) maxWeight = s.weightKg
        if (volume > maxVolume) maxVolume = volume
        if (!bestSet || volume > bestSet.volume) {
            bestSet = { reps: s.reps, weightKg: s.weightKg, volume }
        }
    }

    return { maxWeight, maxVolume, bestSet }
}
