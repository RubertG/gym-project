/*
 * Repository: profiles
 * Responsabilidad: abstraer todo el acceso a datos de la tabla profiles.
 */

import type { DbClient } from '@/lib/db/types';
import type { Profile } from '@/lib/models';

export async function findProfileByUserId(
    db: DbClient,
    userId: string,
): Promise<Profile | null> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}

export async function findProfileByUsername(
    db: DbClient,
    username: string,
): Promise<Profile | null> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .select('*')
        .ilike('username', username)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data ?? null;
}

export async function createProfile(
    db: DbClient,
    userId: string,
    username?: string,
): Promise<Profile> {
    const { data, error } = await db
        .from<Profile>('profiles')
        .insert({ user_id: userId, username: username ?? null })
        .select()
        .single();

    if (error || !data) throw new Error(error?.message ?? 'Error al crear perfil');
    return data;
}

export async function updateProfile(
    db: DbClient,
    userId: string,
    payload: Partial<Pick<Profile, 'username' | 'avatarUrl'>>,
): Promise<Profile> {
    const mapped: Record<string, unknown> = {};

    if (payload.username !== undefined) mapped.username = payload.username;
    if (payload.avatarUrl !== undefined) mapped.avatar_url = payload.avatarUrl;

    const { data, error } = await db
        .from<Profile>('profiles')
        .update(mapped)
        .eq('user_id', userId)
        .select()
        .single();

    if (error || !data) throw new Error(error?.message ?? 'Error al actualizar perfil');
    return data;
}

export async function softDeleteProfile(db: DbClient, userId: string): Promise<void> {
    const { error } = await db
        .from<Profile>('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', userId);

    if (error) throw new Error(error.message);
}
