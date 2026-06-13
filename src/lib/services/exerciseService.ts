/*
 * Service: exercises
 * Lógica de negocio para la biblioteca de ejercicios.
 */

import { getServerClient } from '@/lib/db/client';
import * as exerciseRepo from '@/lib/repositories/exerciseRepository';
import * as profileRepo from '@/lib/repositories/profileRepository';
import { ValidationError, NotFoundError, AuthError } from '@/lib/utils/errors';
import type { Exercise } from '@/lib/models';

export async function getAllApprovedExercises(): Promise<Exercise[]> {
    const db = getServerClient();

    return exerciseRepo.findAllApprovedExercises(db);
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
    const db = getServerClient();

    return exerciseRepo.findExerciseById(db, id);
}

export async function proposeExercise(
    userId: string,
    name: string,
    imageUrl?: string,
): Promise<Exercise> {
    const db = getServerClient();

    if (!name || name.trim().length === 0) {
        throw new ValidationError('El nombre del ejercicio es obligatorio');
    }

    const trimmed = name.trim();
    const existing = await exerciseRepo.findExerciseByNameLower(db, trimmed);

    if (existing) {
        throw new ValidationError('Ya existe un ejercicio con ese nombre');
    }

    return exerciseRepo.createExercise(db, {
        name: trimmed,
        imageUrl,
        createdBy: userId,
        status: 'pending',
    });
}

export async function approveExercise(exerciseId: string, adminUserId: string): Promise<Exercise> {
    const db = getServerClient();

    const exercise = await exerciseRepo.findExerciseById(db, exerciseId);

    if (!exercise) {
        throw new NotFoundError('Ejercicio');
    }

    const adminProfile = await profileRepo.findProfileByUserId(db, adminUserId);

    if (!adminProfile || adminProfile.role !== 'admin') {
        throw new AuthError('Solo los administradores pueden aprobar ejercicios');
    }

    return exerciseRepo.updateExercise(db, exerciseId, { status: 'approved' });
}

export async function searchExercises(query: string): Promise<Exercise[]> {
    const db = getServerClient();

    if (!query || query.trim().length === 0) {
        return exerciseRepo.findAllApprovedExercises(db);
    }

    return exerciseRepo.searchExercisesByName(db, query.trim());
}
