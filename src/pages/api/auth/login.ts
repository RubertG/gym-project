/*
 * POST /api/auth/login
 * Inicio de sesion con email y password.
 * Valida body con Zod, delega a authService.signIn, establece cookies de sesion.
 */

import type { APIContext } from 'astro';
import { z } from 'zod';
import * as authService from '@/lib/services/authService';
import * as profileService from '@/lib/services/profileService';
import { AppError } from '@/lib/utils/errors';
import { env } from '@/lib/config/env';

// Esquema de validacion para login
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

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
 * Extrae el project ref de la URL de Supabase.
 * Formato esperado: https://<project-ref>.supabase.co
 */
function getProjectRef(): string {
    const url = new URL(env.SUPABASE_URL);

    return url.hostname.split('.')[0];
}

/**
 * Establece las cookies de sesion de Supabase en la respuesta.
 * El formato sigue el estandar de Supabase Auth para cookies.
 */
function setSessionCookies(
    context: APIContext,
    session: authService.SignInResult['session']
): void {
    const projectRef = getProjectRef();
    const cookieName = `sb-${projectRef}-auth-token`;
    const sessionJson = JSON.stringify(session);

    // Cookie principal de sesion
    context.cookies.set(cookieName, sessionJson, {
        path: '/',
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        maxAge: session.expires_in,
    });

    // Cookie de codigo de verificacion (compatibilidad con flujos PKCE)
    context.cookies.set(`${cookieName}-code`, '', {
        path: '/',
        sameSite: 'lax',
        secure: true,
        httpOnly: true,
        maxAge: 60,
    });
}

export async function POST(context: APIContext): Promise<Response> {
    let body: unknown;

    try {
        body = await context.request.json();
    } catch {
        return jsonResponse({ error: 'Invalid request body' }, 400);
    }

    const result = loginSchema.safeParse(body);

    if (!result.success) {
        return jsonResponse({ error: 'Invalid email or password' }, 401);
    }

    try {
        const signInResult = await authService.signIn(result.data);

        // Establecer cookies de sesion
        setSessionCookies(context, signInResult.session);

        // Obtener perfil del usuario
        const profile = await profileService.getProfile(signInResult.user.id);

        return jsonResponse(
            {
                user: {
                    id: signInResult.user.id,
                    email: signInResult.user.email,
                },
                profile,
            },
            200
        );
    } catch (err) {
        if (err instanceof AppError && err.isOperational) {
            // Credenciales invalidas → 401
            return jsonResponse({ error: 'Invalid email or password' }, 401);
        }

        return jsonResponse({ error: 'Internal server error' }, 500);
    }
}
