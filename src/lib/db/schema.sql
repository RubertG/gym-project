-- ============================================================
-- IRON TRACK — Schema SQL Completo
-- Supabase PostgreSQL 15+
-- ============================================================
-- Nota: Ejecutar en un proyecto Supabase con auth habilitado.
-- ============================================================

-- ============================================================
-- EXTENSIONES
-- ============================================================
extension if not exists "pgcrypto" with schema extensions;

-- ============================================================
-- 1. TABLAS
-- ============================================================

-- ------------------------------------------------------------
-- 1.1 profiles (complemento de auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    username text,
    avatar_url text,
    role text not null default 'user' check (role in ('user', 'admin')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.2 exercises (biblioteca global)
-- ------------------------------------------------------------
create table if not exists public.exercises (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category text,
    image_url text,
    created_by uuid references public.profiles(id) on delete set null,
    status text not null default 'pending' check (status in ('pending', 'approved')),
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.3 routines
-- ------------------------------------------------------------
create table if not exists public.routines (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    is_active boolean not null default false,
    is_public boolean not null default false,
    likes_count integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.4 routine_days
-- ------------------------------------------------------------
create table if not exists public.routine_days (
    id uuid primary key default gen_random_uuid(),
    routine_id uuid not null references public.routines(id) on delete cascade,
    day_of_week integer not null check (day_of_week between 0 and 6),
    day_name text not null,
    order_index integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.5 routine_exercises
-- ------------------------------------------------------------
create table if not exists public.routine_exercises (
    id uuid primary key default gen_random_uuid(),
    routine_day_id uuid not null references public.routine_days(id) on delete cascade,
    exercise_id uuid references public.exercises(id) on delete set null,
    order_index integer not null default 0,
    suggested_sets integer,
    suggested_reps text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.6 user_active_routine_log
-- ------------------------------------------------------------
create table if not exists public.user_active_routine_log (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    routine_id uuid not null references public.routines(id) on delete cascade,
    activated_at timestamptz not null default now(),
    deactivated_at timestamptz,
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.7 workout_sessions
-- ------------------------------------------------------------
create table if not exists public.workout_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    routine_id uuid references public.routines(id) on delete set null,
    routine_day_id uuid references public.routine_days(id) on delete set null,
    session_date date not null,
    completed_at timestamptz,
    note text,
    status text not null default 'draft' check (status in ('draft', 'completed')),
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.8 workout_sets
-- ------------------------------------------------------------
create table if not exists public.workout_sets (
    id uuid primary key default gen_random_uuid(),
    workout_session_id uuid not null references public.workout_sessions(id) on delete cascade,
    exercise_id uuid references public.exercises(id) on delete set null,
    set_number integer not null,
    reps integer not null,
    weight_kg numeric(6,2) not null,
    note text,
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 1.9 routine_likes
-- ------------------------------------------------------------
create table if not exists public.routine_likes (
    id uuid primary key default gen_random_uuid(),
    routine_id uuid not null references public.routines(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    deleted_at timestamptz,
    unique (routine_id, user_id)
);

-- ============================================================
-- 2. CONSTRAINTS E ÍNDICES
-- ============================================================

-- Índice funcional único en exercises.name (case-insensitive)
create unique index if not exists idx_exercises_lower_name on public.exercises (lower(name))
    where deleted_at is null;

-- Partial unique index: solo una rutina activa por usuario
create unique index if not exists idx_routines_unique_active on public.routines (user_id, is_active)
    where is_active = true and deleted_at is null;

-- Índices de búsqueda frecuente
create index if not exists idx_routines_user_id on public.routines(user_id) where deleted_at is null;
create index if not exists idx_routines_is_public on public.routines(is_public) where is_public = true and deleted_at is null;
create index if not exists idx_routine_days_routine_id on public.routine_days(routine_id) where deleted_at is null;
create index if not exists idx_routine_exercises_day_id on public.routine_exercises(routine_day_id) where deleted_at is null;
create index if not exists idx_workout_sessions_user_id on public.workout_sessions(user_id) where deleted_at is null;
create index if not exists idx_workout_sessions_date on public.workout_sessions(session_date) where deleted_at is null;
create index if not exists idx_workout_sets_session_id on public.workout_sets(workout_session_id) where deleted_at is null;
create index if not exists idx_workout_sets_exercise_id on public.workout_sets(exercise_id) where deleted_at is null;

-- ============================================================
-- 3. FUNCTIONS (HELPERS)
-- ============================================================

-- Función genérica para auto-actualizar updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- 4.1 Auto-crear profile al insertar en auth.users
create or replace function public.create_profile_after_user_insert()
returns trigger as $$
begin
    insert into public.profiles (user_id, role)
    values (new.id, 'user');
    return new;
end;
$$ language plpgsql security definer;

-- Nota: este trigger se debe crear en el schema auth
-- En Supabase, los triggers sobre auth.users deben crearse con cuidado
-- usando la consola SQL o la CLI. Se deja aquí documentado.
-- Si se ejecuta con privilegios suficientes:
-- create trigger trigger_create_profile_after_user_insert
--   after insert on auth.users
--   for each row
--   execute function public.create_profile_after_user_insert();

-- 4.2 Actualizar likes_count en routines
create or replace function public.update_routine_likes_count()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update public.routines
        set likes_count = likes_count + 1
        where id = new.routine_id;
        return new;
    elsif (tg_op = 'DELETE') then
        update public.routines
        set likes_count = likes_count - 1
        where id = old.routine_id;
        return old;
    end if;
    return null;
end;
$$ language plpgsql;

create trigger trigger_update_likes_count
    after insert or delete on public.routine_likes
    for each row
    execute function public.update_routine_likes_count();

-- 4.3 Cerrar rutina activa anterior al activar una nueva
create or replace function public.close_previous_active_routine()
returns trigger as $$
begin
    -- Solo actuar cuando se activa (is_active pasa a true)
    if new.is_active = true then
        -- Desactivar la rutina activa anterior del mismo usuario
        update public.routines
        set is_active = false
        where user_id = new.user_id
          and is_active = true
          and id <> new.id;

        -- Cerrar el log anterior si existe
        update public.user_active_routine_log
        set deactivated_at = now()
        where user_id = new.user_id
          and deactivated_at is null;

        -- Insertar nuevo registro de activación
        insert into public.user_active_routine_log (user_id, routine_id)
        values (new.user_id, new.id);
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trigger_close_previous_active_routine
    after insert or update of is_active on public.routines
    for each row
    when (new.is_active = true)
    execute function public.close_previous_active_routine();

-- 4.4 Auto-actualizar updated_at en routines y profiles
create trigger trigger_set_updated_at_routines
    before update on public.routines
    for each row
    execute function public.set_updated_at();

create trigger trigger_set_updated_at_profiles
    before update on public.profiles
    for each row
    execute function public.set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activar RLS en todas las tablas de usuario
alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_days enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.user_active_routine_log enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sets enable row level security;
alter table public.routine_likes enable row level security;

-- ------------------------------------------------------------
-- 5.1 profiles
-- ------------------------------------------------------------
-- Usuarios solo ven/editan su propio perfil. Admin ve todos.
create policy "profiles_select_own"
    on public.profiles
    for select
    using (auth.uid() = user_id or (select role from public.profiles where user_id = auth.uid()) = 'admin');

create policy "profiles_update_own"
    on public.profiles
    for update
    using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5.2 exercises
-- ------------------------------------------------------------
-- Lectura pública para ejercicios aprobados. Escritura solo admin o propietario.
create policy "exercises_select_approved"
    on public.exercises
    for select
    using (status = 'approved' or created_by = auth.uid() or (select role from public.profiles where user_id = auth.uid()) = 'admin');

create policy "exercises_insert_own"
    on public.exercises
    for insert
    with check (created_by = auth.uid());

create policy "exercises_update_own_or_admin"
    on public.exercises
    for update
    using (created_by = auth.uid() or (select role from public.profiles where user_id = auth.uid()) = 'admin');

-- ------------------------------------------------------------
-- 5.3 routines
-- ------------------------------------------------------------
-- Usuarios ven las suyas + las públicas. Solo editan las suyas.
create policy "routines_select_own_or_public"
    on public.routines
    for select
    using (user_id = auth.uid() or is_public = true);

create policy "routines_insert_own"
    on public.routines
    for insert
    with check (user_id = auth.uid());

create policy "routines_update_own"
    on public.routines
    for update
    using (user_id = auth.uid());

create policy "routines_delete_own"
    on public.routines
    for delete
    using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 5.4 routine_days
-- ------------------------------------------------------------
create policy "routine_days_select_via_routine"
    on public.routine_days
    for select
    using (
        exists (
            select 1 from public.routines r
            where r.id = routine_id
            and (r.user_id = auth.uid() or r.is_public = true)
        )
    );

create policy "routine_days_insert_own"
    on public.routine_days
    for insert
    with check (
        exists (
            select 1 from public.routines r
            where r.id = routine_id
            and r.user_id = auth.uid()
        )
    );

create policy "routine_days_update_own"
    on public.routine_days
    for update
    using (
        exists (
            select 1 from public.routines r
            where r.id = routine_id
            and r.user_id = auth.uid()
        )
    );

create policy "routine_days_delete_own"
    on public.routine_days
    for delete
    using (
        exists (
            select 1 from public.routines r
            where r.id = routine_id
            and r.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 5.5 routine_exercises
-- ------------------------------------------------------------
create policy "routine_exercises_select_via_routine"
    on public.routine_exercises
    for select
    using (
        exists (
            select 1 from public.routine_days rd
            join public.routines r on r.id = rd.routine_id
            where rd.id = routine_day_id
            and (r.user_id = auth.uid() or r.is_public = true)
        )
    );

create policy "routine_exercises_insert_own"
    on public.routine_exercises
    for insert
    with check (
        exists (
            select 1 from public.routine_days rd
            join public.routines r on r.id = rd.routine_id
            where rd.id = routine_day_id
            and r.user_id = auth.uid()
        )
    );

create policy "routine_exercises_update_own"
    on public.routine_exercises
    for update
    using (
        exists (
            select 1 from public.routine_days rd
            join public.routines r on r.id = rd.routine_id
            where rd.id = routine_day_id
            and r.user_id = auth.uid()
        )
    );

create policy "routine_exercises_delete_own"
    on public.routine_exercises
    for delete
    using (
        exists (
            select 1 from public.routine_days rd
            join public.routines r on r.id = rd.routine_id
            where rd.id = routine_day_id
            and r.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 5.6 user_active_routine_log
-- ------------------------------------------------------------
create policy "user_active_routine_log_select_own"
    on public.user_active_routine_log
    for select
    using (user_id = auth.uid());

create policy "user_active_routine_log_insert_own"
    on public.user_active_routine_log
    for insert
    with check (user_id = auth.uid());

create policy "user_active_routine_log_update_own"
    on public.user_active_routine_log
    for update
    using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 5.7 workout_sessions
-- ------------------------------------------------------------
create policy "workout_sessions_select_own"
    on public.workout_sessions
    for select
    using (user_id = auth.uid());

create policy "workout_sessions_insert_own"
    on public.workout_sessions
    for insert
    with check (user_id = auth.uid());

create policy "workout_sessions_update_own"
    on public.workout_sessions
    for update
    using (user_id = auth.uid());

create policy "workout_sessions_delete_own"
    on public.workout_sessions
    for delete
    using (user_id = auth.uid());

-- ------------------------------------------------------------
-- 5.8 workout_sets
-- ------------------------------------------------------------
create policy "workout_sets_select_own"
    on public.workout_sets
    for select
    using (
        exists (
            select 1 from public.workout_sessions ws
            where ws.id = workout_session_id
            and ws.user_id = auth.uid()
        )
    );

create policy "workout_sets_insert_own"
    on public.workout_sets
    for insert
    with check (
        exists (
            select 1 from public.workout_sessions ws
            where ws.id = workout_session_id
            and ws.user_id = auth.uid()
        )
    );

create policy "workout_sets_update_own"
    on public.workout_sets
    for update
    using (
        exists (
            select 1 from public.workout_sessions ws
            where ws.id = workout_session_id
            and ws.user_id = auth.uid()
        )
    );

create policy "workout_sets_delete_own"
    on public.workout_sets
    for delete
    using (
        exists (
            select 1 from public.workout_sessions ws
            where ws.id = workout_session_id
            and ws.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------
-- 5.9 routine_likes
-- ------------------------------------------------------------
create policy "routine_likes_select_public"
    on public.routine_likes
    for select
    using (true);

create policy "routine_likes_insert_own"
    on public.routine_likes
    for insert
    with check (user_id = auth.uid());

create policy "routine_likes_delete_own"
    on public.routine_likes
    for delete
    using (user_id = auth.uid());

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
