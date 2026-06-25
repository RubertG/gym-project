-- ============================================================
-- Migración: Módulo 02 — Multimedia y aprobación de ejercicios
-- Fecha: 2025-06-24
-- ============================================================
-- Idempotente: puede ejecutarse varias veces sin errores.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabla exercise_media
-- ------------------------------------------------------------
create table if not exists public.exercise_media (
    id uuid primary key default gen_random_uuid(),
    exercise_id uuid not null references public.exercises(id) on delete cascade,
    type text not null check (type in ('image', 'video')),
    url text not null,
    thumbnail_url text,
    order_index integer not null default 0,
    created_at timestamptz not null default now(),
    deleted_at timestamptz
);

-- ------------------------------------------------------------
-- 2. Actualizar tabla exercises
-- ------------------------------------------------------------
-- Agregar rejection_reason si no existe.
do $$
begin
    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'exercises'
          and column_name = 'rejection_reason'
    ) then
        alter table public.exercises add column rejection_reason text;
    end if;
end $$;

-- Ampliar el CHECK de status para incluir 'rejected'.
alter table public.exercises drop constraint if exists exercises_status_check;
alter table public.exercises add constraint exercises_status_check
    check (status in ('pending', 'approved', 'rejected'));

-- Migrar image_url existente a exercise_media y eliminar la columna.
do $$
begin
    if exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'exercises'
          and column_name = 'image_url'
    ) then
        insert into public.exercise_media (exercise_id, type, url, order_index)
        select id, 'image', image_url, 0
        from public.exercises
        where image_url is not null
          and deleted_at is null;

        alter table public.exercises drop column image_url;
    end if;
end $$;

-- ------------------------------------------------------------
-- 3. Índices
-- ------------------------------------------------------------
create index if not exists idx_exercise_media_exercise_id
    on public.exercise_media(exercise_id)
    where deleted_at is null;

create index if not exists idx_exercise_media_exercise_order
    on public.exercise_media(exercise_id, order_index)
    where deleted_at is null;

-- ------------------------------------------------------------
-- 4. RLS
-- ------------------------------------------------------------
alter table public.exercise_media enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'exercise_media'
          and policyname = 'exercise_media_select_approved_or_own'
    ) then
        create policy "exercise_media_select_approved_or_own"
            on public.exercise_media
            for select
            using (
                deleted_at is null
                and exists (
                    select 1 from public.exercises e
                    where e.id = exercise_id
                      and e.deleted_at is null
                      and (
                          e.status = 'approved'
                          or e.created_by = auth.uid()
                          or exists (
                              select 1 from public.profiles
                              where id = auth.uid()
                                and role = 'admin'
                                and deleted_at is null
                          )
                      )
                )
            );
    end if;

    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'exercise_media'
          and policyname = 'exercise_media_insert_own_pending_or_admin'
    ) then
        create policy "exercise_media_insert_own_pending_or_admin"
            on public.exercise_media
            for insert
            with check (
                exists (
                    select 1 from public.exercises e
                    where e.id = exercise_id
                      and e.deleted_at is null
                      and (
                          (e.status = 'pending' and e.created_by = auth.uid())
                          or exists (
                              select 1 from public.profiles
                              where id = auth.uid()
                                and role = 'admin'
                                and deleted_at is null
                          )
                      )
                )
            );
    end if;

    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'exercise_media'
          and policyname = 'exercise_media_update_own_pending_or_admin'
    ) then
        create policy "exercise_media_update_own_pending_or_admin"
            on public.exercise_media
            for update
            using (
                deleted_at is null
                and exists (
                    select 1 from public.exercises e
                    where e.id = exercise_id
                      and e.deleted_at is null
                      and (
                          (e.status = 'pending' and e.created_by = auth.uid())
                          or exists (
                              select 1 from public.profiles
                              where id = auth.uid()
                                and role = 'admin'
                                and deleted_at is null
                          )
                      )
                )
            );
    end if;

    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
          and tablename = 'exercise_media'
          and policyname = 'exercise_media_delete_own_pending_or_admin'
    ) then
        create policy "exercise_media_delete_own_pending_or_admin"
            on public.exercise_media
            for delete
            using (
                deleted_at is null
                and exists (
                    select 1 from public.exercises e
                    where e.id = exercise_id
                      and e.deleted_at is null
                      and (
                          (e.status = 'pending' and e.created_by = auth.uid())
                          or exists (
                              select 1 from public.profiles
                              where id = auth.uid()
                                and role = 'admin'
                                and deleted_at is null
                          )
                      )
                )
            );
    end if;
end $$;

-- ------------------------------------------------------------
-- 5. Trigger de soft-delete en cascada para exercise_media
-- ------------------------------------------------------------
create or replace function public.cascade_soft_delete_exercise_media()
returns trigger as $$
begin
    update public.exercise_media
    set deleted_at = now()
    where exercise_id = old.id
      and deleted_at is null;

    return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_cascade_soft_delete_exercise_media on public.exercises;
create trigger trigger_cascade_soft_delete_exercise_media
    before update of deleted_at on public.exercises
    for each row
    when (new.deleted_at is not null and old.deleted_at is null)
    execute function public.cascade_soft_delete_exercise_media();
