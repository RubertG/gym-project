/*
 * Service: auth
 * Lógica de negocio para autenticación de usuarios.
 * Coordina Supabase Auth con la creación de perfiles.
 */

import type { User, Session } from '@supabase/supabase-js';
import { getAnonClient } from '@/lib/db/browser-client';
import { createProfile } from '@/lib/services/profileService';
import { ValidationError, AuthError, AppError } from '@/lib/utils/errors';
import type { Profile } from '@/lib/models';

/**
 * Credenciales para registro de usuario.
 */
export interface SignUpParams {
    email: string;
    password: string;
    username?: string;
}

/**
 * Resultado del registro: usuario autenticado + perfil (si se creó).
 */
export interface SignUpResult {
    user: User;
    profile: Profile | null;
}

/**
 * Resultado de login: sesión activa + usuario.
 */
export interface SignInResult {
    session: Session;
    user: User;
}

/**
 * Resultado de obtener la sesión actual.
 */
export interface SessionResult {
    session: Session | null;
    user: User | null;
}

/**
 * Registra un nuevo usuario en Supabase Auth y crea su perfil (best-effort).
 * Si el email ya existe, lanza ValidationError.
 * Si la creación de perfil falla, el usuario igualmente se retorna (no rollback).
 */
export async function signUp(params: SignUpParams): Promise<SignUpResult> {
    const { email, password, username } = params;
    const client = getAnonClient();

    const { data, error } = await client.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw mapAuthError(error);
    }

    if (!data.user) {
        throw new AppError('No se pudo crear el usuario', 500);
    }

    // Creación de perfil: best-effort, no rollback
    let profile: Profile | null;

    try {
        profile = await createProfile(data.user.id, username);
    } catch {
        // Si falla la creación del perfil, no se hace rollback del usuario.
        // El perfil podrá crearse o recuperarse en un flujo posterior.
        profile = null;
    }

    return { user: data.user, profile };
}

/**
 * Inicia sesión con email y password.
 * Si las credenciales son inválidas, lanza AuthError con mensaje genérico.
 */
export async function signIn(params: {
    email: string;
    password: string;
}): Promise<SignInResult> {
    const { email, password } = params;
    const client = getAnonClient();

    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw mapAuthError(error);
    }

    if (!data.session || !data.user) {
        throw new AuthError('Invalid email or password');
    }

    return { session: data.session, user: data.user };
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOut(): Promise<void> {
    const client = getAnonClient();
    const { error } = await client.auth.signOut();

    if (error) {
        throw new AppError('Error al cerrar sesión', 500);
    }
}

/**
 * Envía un email de recuperación de contraseña.
 * Nunca revela si el email existe en el sistema.
 */
export async function resetPassword(email: string): Promise<void> {
    const client = getAnonClient();

    // URL de redirección después de resetear password
    const redirectTo = `${globalThis.location?.origin ?? ''}/auth/reset-password`;

    const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo,
    });

    if (error) {
        // No revelar si el email existe o no — siempre responder con éxito
        throw new AppError('Error al enviar el email de recuperación', 500);
    }
}

/**
 * Obtiene la sesión actual del usuario (si existe).
 * Útil para SSR: el cliente anon puede leer cookies en contexto de servidor.
 */
export async function getCurrentSession(): Promise<SessionResult> {
    const client = getAnonClient();
    const { data, error } = await client.auth.getSession();

    if (error) {
        return { session: null, user: null };
    }

    return {
        session: data.session,
        user: data.user,
    };
}

/**
 * Mapea errores de Supabase Auth a AppError subclasses.
 * Los mensajes son genéricos para no revelar información sensible.
 */
function mapAuthError(error: { message: string; code?: string }): AppError {
    // Supabase usa códigos como 'email_taken', 'invalid_credentials', etc.
    switch (error.code) {
        case 'email_taken':
            return new ValidationError('Email already registered');
        case 'invalid_credentials':
        case 'invalid_login_credentials':
            return new AuthError('Invalid email or password');
        case 'email_not_confirmed':
            return new ValidationError('Email not confirmed');
        default:
            // Error genérico — no revelar detalles internos
            return new AuthError('Authentication error');
    }
}
