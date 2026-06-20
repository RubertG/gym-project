/*
 * GET /api/auth/me
 * Retorna el usuario autenticado y su perfil.
 * Requiere sesion activa (locals.user seteado por middleware).
 */

export const prerender = false;

import type { APIContext } from 'astro';
import * as profileService from '@/lib/services/profileService';

/**
 * Helper para respuestas JSON.
 */
function jsonResponse(data: unknown, status: number): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(context: APIContext): Promise<Response> {
    const { user } = context.locals;

    if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const profile = await profileService.getProfile(user.id);

    return jsonResponse(
        {
            user: { id: user.id },
            profile,
        },
        200
    );
}
