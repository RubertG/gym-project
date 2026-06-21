/*
 * Service: profiles
 * Lógica de negocio para gestión de perfiles de usuario.
 */

import { getServerClient } from '@/lib/db/client'
import * as profileRepo from '@/lib/repositories/profileRepository'
import { ValidationError, NotFoundError } from '@/lib/utils/errors'
import type { Profile } from '@/lib/models'
import type { DbClient } from '@/lib/db/types'

export async function getProfile(
    userId: string,
    db?: DbClient
): Promise<Profile | null> {
    const client = db || getServerClient()
    const profile = await profileRepo.findProfileByUserId(client, userId)

    return profile
}

export async function createProfile(
    data: { userId: string; username?: string },
    db?: DbClient
): Promise<Profile> {
    const client = db || getServerClient()
    const { userId, username } = data

    if (username) {
        const normalized = username.trim().toLowerCase()

        if (normalized.length < 3) {
            throw new ValidationError(
                'El nombre de usuario debe tener al menos 3 caracteres'
            )
        }
        const existing = await profileRepo.findProfileByUsername(
            client,
            normalized
        )

        if (existing) {
            throw new ValidationError('El nombre de usuario ya está en uso')
        }
    }

    return profileRepo.createProfile(
        client,
        userId,
        username?.trim().toLowerCase()
    )
}

export async function updateProfile(
    userId: string,
    data: Partial<Pick<Profile, 'username' | 'avatarUrl'>>,
    db?: DbClient
): Promise<Profile> {
    const client = db || getServerClient()

    const current = await profileRepo.findProfileByUserId(client, userId)

    if (!current) {
        throw new NotFoundError('Perfil')
    }

    if (data.username) {
        const normalized = data.username.trim().toLowerCase()

        if (normalized.length < 3) {
            throw new ValidationError(
                'El nombre de usuario debe tener al menos 3 caracteres'
            )
        }
        const existing = await profileRepo.findProfileByUsername(
            client,
            normalized
        )

        if (existing && existing.id !== userId) {
            throw new ValidationError('El nombre de usuario ya está en uso')
        }
        data.username = normalized
    }

    return profileRepo.updateProfile(client, userId, data)
}

export async function softDeleteProfile(
    userId: string,
    db?: DbClient
): Promise<void> {
    const client = db || getServerClient()

    const current = await profileRepo.findProfileByUserId(client, userId)

    if (!current) {
        throw new NotFoundError('Perfil')
    }

    await profileRepo.softDeleteProfile(client, userId)
}
