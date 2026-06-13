import type { SupabaseClient } from '@supabase/supabase-js';

/*
 * Alias de compatibilidad.
 * Antes era una interfaz manual para abstraer la ausencia de @supabase/supabase-js.
 * Ahora que el paquete esta instalado, se usa SupabaseClient directamente.
 */
export type DbClient = SupabaseClient;

/*
 * Tipos genericos de respuesta de base de datos.
 * Mantenidos para compatibilidad con codigo existente.
 */
export interface DbError {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
}

export interface DbResponse<T> {
    data: T | null;
    error: DbError | null;
}

export interface DbQueryBuilder<T = unknown> extends PromiseLike<DbResponse<T[]>> {
    select<R = T>(columns?: string, opts?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }): DbQueryBuilder<R> & { count: number | null };
    insert(values: unknown | unknown[]): DbQueryBuilder<T>;
    update(values: unknown): DbQueryBuilder<T>;
    delete(): DbQueryBuilder<T>;
    eq(column: string, value: unknown): DbQueryBuilder<T>;
    neq(column: string, value: unknown): DbQueryBuilder<T>;
    gt(column: string, value: unknown): DbQueryBuilder<T>;
    gte(column: string, value: unknown): DbQueryBuilder<T>;
    lt(column: string, value: unknown): DbQueryBuilder<T>;
    lte(column: string, value: unknown): DbQueryBuilder<T>;
    like(column: string, value: string): DbQueryBuilder<T>;
    ilike(column: string, value: string): DbQueryBuilder<T>;
    is(column: string, value: unknown): DbQueryBuilder<T>;
    in(column: string, values: unknown[]): DbQueryBuilder<T>;
    contains(column: string, value: unknown): DbQueryBuilder<T>;
    order(column: string, opts?: { ascending?: boolean; nullsFirst?: boolean }): DbQueryBuilder<T>;
    limit(count: number): DbQueryBuilder<T>;
    range(from: number, to: number): DbQueryBuilder<T>;
    single(): Promise<DbResponse<T>>;
    maybeSingle(): Promise<DbResponse<T | null>>;
}

export interface DbAuth {
    getSession(): Promise<DbResponse<{ session: { user: { id: string } } | null }>>;
    getUser(): Promise<DbResponse<{ user: { id: string } | null }>>;
}
