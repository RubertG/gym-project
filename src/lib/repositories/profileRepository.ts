/*
 * Repository: profiles
 * Responsabilidad: abstraer todo el acceso a datos de la tabla profiles.
 */

import type { DbClient } from '@/lib/db/types'
import type { Profile } from '@/lib/models'
import { AppError, NotFoundError } from '@/lib/utils/errors'

export async function findProfileByUserId(
    db: DbClient,
    userId: string
): Promise<Profile | null> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function findProfileByUsername(
    db: DbClient,
    username: string
): Promise<Profile | null> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .select('*')
        .ilike('username', username)
        .maybeSingle()

    if (error) throw new AppError(error.message, 500)
    return data ?? null
}

export async function createProfile(
    db: DbClient,
    userId: string,
    username?: string
): Promise<Profile> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .insert({ id: userId, username: username ?? null })
        .select()
        .single()

    if (error || !data)
        throw new AppError(error?.message ?? 'Error al crear perfil', 500)
    return data
}

export async function updateProfile(
    db: DbClient,
    userId: string,
    payload: Partial<Pick<Profile, 'username' | 'avatarUrl'>>
): Promise<Profile> {
    const mapped: Record<string, unknown> = {}

    if (payload.username !== undefined) mapped.username = payload.username
    if (payload.avatarUrl !== undefined) mapped.avatar_url = payload.avatarUrl

    const { data, error } = await db
        .from<Profile>('profiles')
        .update(mapped)
        .eq('id', userId)
        .select()
        .single()

    if (error || !data) throw new NotFoundError('Perfil')
    return data
}

export async function softDeleteProfile(
    db: DbClient,
    userId: string
): Promise<void> {
    const { error } = await db
        .from<Profile>('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userId)

    if (error) throw new AppError(error.message, 500)
}
