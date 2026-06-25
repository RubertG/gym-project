/*
 * Repository: exercises
 * Responsabilidad: abstraer todo el acceso a datos de la tabla exercises.
 */

import type { DbClient } from '@/lib/db/types'
import type { Exercise } from '@/lib/models'
import { AppError, NotFoundError } from '@/lib/utils/errors'

export async function findAllApprovedExercises(
    db: DbClient
): Promise<Exercise[]> {
    const { data, error } = await db
        .from<Exercise>('exercises')
        .select('*')
        .eq('status', 'approved')
        .is('deleted_at', null)
        .order('name', { ascending: true })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function findExerciseById(
    db: DbClient,
    id: string
): Promise<Exercise | null> {
    const { data, error } = await db
        .from<Exercise>('exercises')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function findExerciseByNameLower(
    db: DbClient,
    name: string
): Promise<Exercise | null> {
    // LOWER(name) comparación case-insensitive
    const { data, error } = await db
        .from<Exercise>('exercises')
        .select('*')
        .ilike('name', name)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function searchExercisesByName(
    db: DbClient,
    query: string
): Promise<Exercise[]> {
    const { data, error } = await db
        .from<Exercise>('exercises')
        .select('*')
        .ilike('name', `%${query}%`)
        .eq('status', 'approved')
        .is('deleted_at', null)
        .order('name', { ascending: true })

    if (error) throw new AppError(error.message, 500)
    return data ?? []
}

export async function createExercise(
    db: DbClient,
    payload: {
        name: string
        imageUrl?: string
        category?: string
        createdBy: string | null
        status: 'pending' | 'approved'
    }
): Promise<Exercise> {
    const { data, error } = await db
        .from<Exercise>('exercises')
        .insert({
            name: payload.name,
            image_url: payload.imageUrl ?? null,
            category: payload.category ?? null,
            created_by: payload.createdBy,
            status: payload.status,
        })
        .select()
        .single()

    if (error || !data)
        throw new AppError(error?.message ?? 'Error al crear ejercicio', 500)
    return data
}

export async function updateExercise(
    db: DbClient,
    id: string,
    payload: Partial<
        Pick<Exercise, 'name' | 'imageUrl' | 'category' | 'status'>
    >
): Promise<Exercise> {
    const mapped: Record<string, unknown> = {}

    if (payload.name !== undefined) mapped.name = payload.name
    if (payload.imageUrl !== undefined) mapped.image_url = payload.imageUrl
    if (payload.category !== undefined) mapped.category = payload.category
    if (payload.status !== undefined) mapped.status = payload.status

    const { data, error } = await db
        .from<Exercise>('exercises')
        .update(mapped)
        .eq('id', id)
        .select()
        .single()

    if (error || !data) throw new NotFoundError('Ejercicio')
    return data
}

export async function softDeleteExercise(
    db: DbClient,
    id: string
): Promise<void> {
    const { error } = await db
        .from<Exercise>('exercises')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new AppError(error.message, 500)
}
