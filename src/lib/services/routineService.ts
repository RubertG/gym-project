/*
 * Service: routines
 * Lógica de negocio para gestión de rutinas, días, ejercicios y likes.
 */

import { getServerClient } from '@/lib/db/client';
import * as routineRepo from '@/lib/repositories/routineRepository';
import * as exerciseRepo from '@/lib/repositories/exerciseRepository';
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors';
import type { Routine, RoutineDay, RoutineExercise } from '@/lib/models';
import type { RoutineDayInput } from '@/lib/models/dto';

/* ─────────── helpers ─────────── */

function ensureOwnership(routine: Routine, userId: string): void {
    if (routine.userId !== userId) {
        throw new AuthError('No tienes permiso para modificar esta rutina');
    }
}

async function ensureNoSessions(db: ReturnType<typeof getServerClient>, routineId: string): Promise<void> {
    const count = await routineRepo.countSessionsByRoutineId(db, routineId);

    if (count > 0) {
        throw new ValidationError(
            'Esta rutina ya tiene sesiones registradas. Solo puedes duplicarla.',
        );
    }
}

/* ─────────── lectura ─────────── */

export async function getRoutinesByUser(userId: string): Promise<Routine[]> {
    const db = getServerClient();

    return routineRepo.findRoutinesByUser(db, userId);
}

export async function getPublicRoutines(): Promise<Routine[]> {
    const db = getServerClient();

    return routineRepo.findPublicRoutines(db);
}

export async function getRoutineById(
    id: string,
): Promise<{
    routine: Routine;
    days: (RoutineDay & { exercises: RoutineExercise[] })[];
} | null> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, id);

    if (!routine) return null;

    const days = await routineRepo.findDaysByRoutineId(db, id);
    const daysWithExercises = await Promise.all(
        days.map(async (day) => {
            const exercises = await routineRepo.findExercisesByDayId(db, day.id);

            return { ...day, exercises };
        }),
    );

    return { routine, days: daysWithExercises };
}

/* ─────────── creación ─────────── */

export async function createRoutine(
    userId: string,
    name: string,
    days: RoutineDayInput[],
): Promise<Routine> {
    const db = getServerClient();

    if (!name || name.trim().length === 0) {
        throw new ValidationError('El nombre de la rutina es obligatorio');
    }

    if (days.length === 0) {
        throw new ValidationError('La rutina debe tener al menos un día configurado');
    }

    const routine = await routineRepo.createRoutine(db, { userId, name: name.trim() });

    for (const dayInput of days) {
        const day = await routineRepo.createRoutineDay(db, {
            routineId: routine.id,
            dayOfWeek: dayInput.dayOfWeek,
            dayName: dayInput.dayName.trim(),
            orderIndex: dayInput.orderIndex,
        });

        for (const exInput of dayInput.exercises) {
            const exercise = await exerciseRepo.findExerciseById(db, exInput.exerciseId);

            if (!exercise || exercise.status !== 'approved') {
                throw new ValidationError(`El ejercicio ${exInput.exerciseId} no está aprobado o no existe`);
            }

            await routineRepo.createRoutineExercise(db, {
                routineDayId: day.id,
                exerciseId: exInput.exerciseId,
                orderIndex: exInput.orderIndex,
                suggestedSets: exInput.suggestedSets ?? null,
                suggestedReps: exInput.suggestedReps ?? null,
                notes: exInput.notes ?? null,
            });
        }
    }

    return routine;
}

/* ─────────── actualización ─────────── */

export async function updateRoutine(
    id: string,
    userId: string,
    data: Partial<Pick<Routine, 'name' | 'isPublic'>>,
): Promise<Routine> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, id);

    if (!routine) throw new NotFoundError('Rutina');
    ensureOwnership(routine, userId);
    await ensureNoSessions(db, id);

    if (data.name !== undefined && data.name.trim().length === 0) {
        throw new ValidationError('El nombre de la rutina no puede estar vacío');
    }

    return routineRepo.updateRoutine(db, id, {
        name: data.name?.trim(),
        isPublic: data.isPublic,
    });
}

export async function activateRoutine(id: string, userId: string): Promise<Routine> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, id);

    if (!routine) throw new NotFoundError('Rutina');
    ensureOwnership(routine, userId);

    return routineRepo.updateRoutine(db, id, { isActive: true });
}

export async function publishRoutine(id: string, userId: string): Promise<Routine> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, id);

    if (!routine) throw new NotFoundError('Rutina');
    ensureOwnership(routine, userId);

    return routineRepo.updateRoutine(db, id, { isPublic: true });
}

/* ─────────── duplicado ─────────── */

export async function duplicateRoutine(id: string, userId: string): Promise<Routine> {
    const db = getServerClient();

    const source = await getRoutineById(id);

    if (!source) throw new NotFoundError('Rutina');

    const newRoutine = await routineRepo.createRoutine(db, {
        userId,
        name: `${source.routine.name} (copia)`,
        isPublic: false,
    });

    for (const day of source.days) {
        const newDay = await routineRepo.createRoutineDay(db, {
            routineId: newRoutine.id,
            dayOfWeek: day.dayOfWeek,
            dayName: day.dayName,
            orderIndex: day.orderIndex,
        });

        for (const ex of day.exercises) {
            await routineRepo.createRoutineExercise(db, {
                routineDayId: newDay.id,
                exerciseId: ex.exerciseId,
                orderIndex: ex.orderIndex,
                suggestedSets: ex.suggestedSets,
                suggestedReps: ex.suggestedReps,
                notes: ex.notes,
            });
        }
    }

    return newRoutine;
}

/* ─────────── soft delete ─────────── */

export async function softDeleteRoutine(id: string, userId: string): Promise<void> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, id);

    if (!routine) throw new NotFoundError('Rutina');
    ensureOwnership(routine, userId);
    await ensureNoSessions(db, id);

    await routineRepo.softDeleteRoutine(db, id);
}

/* ─────────── likes ─────────── */

export async function likeRoutine(userId: string, routineId: string): Promise<void> {
    const db = getServerClient();

    const routine = await routineRepo.findRoutineById(db, routineId);

    if (!routine) throw new NotFoundError('Rutina');
    if (!routine.isPublic) {
        throw new ValidationError('Solo se pueden dar like a rutinas públicas');
    }

    const existing = await routineRepo.findLike(db, userId, routineId);

    if (existing) return; // idempotente

    await routineRepo.createLike(db, userId, routineId);
}

export async function unlikeRoutine(userId: string, routineId: string): Promise<void> {
    const db = getServerClient();

    const existing = await routineRepo.findLike(db, userId, routineId);

    if (!existing) return; // idempotente

    await routineRepo.deleteLike(db, userId, routineId);
}
