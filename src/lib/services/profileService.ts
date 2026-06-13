/*
 * Service: profiles
 * Lógica de negocio para gestión de perfiles de usuario.
 */

import { getServerClient } from '@/lib/db/client';
import * as profileRepo from '@/lib/repositories/profileRepository';
import { ValidationError, NotFoundError } from '@/lib/utils/errors';
import type { Profile } from '@/lib/models';

export async function getProfile(userId: string): Promise<Profile | null> {
    const db = getServerClient();
    const profile = await profileRepo.findProfileByUserId(db, userId);

    return profile;
}

export async function createProfile(
    userId: string,
    username?: string,
): Promise<Profile> {
    const db = getServerClient();

    if (username) {
        const normalized = username.trim().toLowerCase();

        if (normalized.length < 3) {
            throw new ValidationError('El nombre de usuario debe tener al menos 3 caracteres');
        }
        const existing = await profileRepo.findProfileByUsername(db, normalized);

        if (existing) {
            throw new ValidationError('El nombre de usuario ya está en uso');
        }
    }

    return profileRepo.createProfile(db, userId, username?.trim().toLowerCase());
}

export async function updateProfile(
    userId: string,
    data: Partial<Pick<Profile, 'username' | 'avatarUrl'>>,
): Promise<Profile> {
    const db = getServerClient();

    const current = await profileRepo.findProfileByUserId(db, userId);

    if (!current) {
        throw new NotFoundError('Perfil');
    }

    if (data.username) {
        const normalized = data.username.trim().toLowerCase();

        if (normalized.length < 3) {
            throw new ValidationError('El nombre de usuario debe tener al menos 3 caracteres');
        }
        const existing = await profileRepo.findProfileByUsername(db, normalized);

        if (existing && existing.userId !== userId) {
            throw new ValidationError('El nombre de usuario ya está en uso');
        }
        data.username = normalized;
    }

    return profileRepo.updateProfile(db, userId, data);
}

export async function softDeleteProfile(userId: string): Promise<void> {
    const db = getServerClient();

    const current = await profileRepo.findProfileByUserId(db, userId);

    if (!current) {
        throw new NotFoundError('Perfil');
    }

    await profileRepo.softDeleteProfile(db, userId);
}
