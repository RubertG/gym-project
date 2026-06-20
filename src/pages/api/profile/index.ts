/*
 * GET /api/profile  — Obtener perfil del usuario autenticado
 * PATCH /api/profile — Actualizar perfil del usuario autenticado
 *
 * Siempre usa locals.user.id (nunca confiamos en IDs del cliente).
 */

export const prerender = false;

import type { APIContext } from 'astro';
import { z } from 'zod';
import * as profileService from '@/lib/services/profileService';
import { AppError } from '@/lib/utils/errors';

// Esquema de validacion para actualizacion de perfil
const updateProfileSchema = z
    .object({
        username: z
            .string()
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username must be at most 30 characters')
            .regex(
                /^[a-zA-Z0-9_]+$/,
                'Username must contain only letters, numbers and underscores'
            )
            .optional(),
        avatarUrl: z.string().url().max(2048).nullable().optional(),
    })
    .refine(
        (data) => data.username !== undefined || data.avatarUrl !== undefined,
        { message: 'At least one field required' }
    );

/**
 * Helper para respuestas JSON.
 */
function jsonResponse(data: unknown, status: number): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Convierte un Zod error en un array de mensajes de detalle.
 */
function zodIssuesToDetails(
    error: z.ZodError
): { field: string; message: string }[] {
    return error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));
}

/**
 * GET /api/profile
 * Retorna el perfil del usuario autenticado.
 */
export async function GET(context: APIContext): Promise<Response> {
    const { user } = context.locals;

    if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const profile = await profileService.getProfile(user.id);

    if (!profile) {
        return jsonResponse({ error: 'Profile not found' }, 404);
    }

    return jsonResponse(
        {
            id: profile.id,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            role: profile.role,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        },
        200
    );
}

/**
 * PATCH /api/profile
 * Actualiza los campos editables del perfil.
 * Nunca confia en IDs del cliente — siempre usa locals.user.id.
 */
export async function PATCH(context: APIContext): Promise<Response> {
    const { user } = context.locals;

    if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    let body: unknown;

    try {
        body = await context.request.json();
    } catch {
        return jsonResponse({ error: 'At least one field required' }, 400);
    }

    // Validar que el body no este vacio
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
        return jsonResponse({ error: 'At least one field required' }, 400);
    }

    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
        // Si el error es del refine (objeto vacio), retornar mensaje especifico
        const hasRefineError = result.error.issues.some(
            (issue) => issue.code === 'custom'
        );

        if (hasRefineError && result.error.issues.length === 1) {
            return jsonResponse({ error: 'At least one field required' }, 400);
        }

        return jsonResponse(
            {
                error: 'Validation failed',
                details: zodIssuesToDetails(result.error),
            },
            400
        );
    }

    // Normalizar username antes de pasar al servicio
    const updateData: { username?: string; avatarUrl?: string | null } = {};

    if (result.data.username !== undefined) {
        updateData.username = result.data.username.trim().toLowerCase();
    }

    if (result.data.avatarUrl !== undefined) {
        updateData.avatarUrl = result.data.avatarUrl;
    }

    try {
        const updated = await profileService.updateProfile(user.id, updateData);

        return jsonResponse(
            {
                id: updated.id,
                username: updated.username,
                avatarUrl: updated.avatarUrl,
                role: updated.role,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
            200
        );
    } catch (err) {
        if (err instanceof AppError) {
            // Username en uso → 409
            if (
                err.message.includes('ya está en uso') ||
                err.message.includes('already in use')
            ) {
                return jsonResponse({ error: 'Username already in use' }, 409);
            }

            if (err.isOperational) {
                return jsonResponse({ error: err.message }, err.statusCode);
            }
        }

        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
