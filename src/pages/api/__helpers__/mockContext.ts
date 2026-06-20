/*
 * Helpers para tests de API routes.
 * Provee mocks de APIContext de Astro para testing unitario.
 */

import { vi } from 'vitest'
import type { APIContext } from 'astro'

/**
 * Crea un mock de APIContext para tests de API routes.
 */
export function createMockContext(
    options: {
        body?: unknown;
        user?: { id: string } | null;
        profile?: unknown;
        cookies?: string;
    } = {}
): APIContext {
    const {
        body,
        user = null,
        profile = null,
        cookies: cookieHeader = '',
    } = options

    // Mock del request
    const request = {
        json:
            body !== undefined
                ? vi.fn().mockResolvedValue(body)
                : vi.fn().mockRejectedValue(new Error('No body')),
        headers: new Headers({
            cookie: cookieHeader,
        }),
    } as unknown as Request

    // Mock de cookies
    const cookies = {
        set: vi.fn(),
        delete: vi.fn(),
        get: vi.fn(),
    }

    return {
        request,
        cookies,
        locals: { user, profile },
    } as unknown as APIContext
}
