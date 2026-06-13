-- ============================================================
-- IRON TRACK — Seed Data
-- Supabase PostgreSQL 15+
-- ============================================================
-- Ejecutar después de aplicar schema.sql
-- ============================================================

-- ============================================================
-- 1. USUARIO DE EJEMPLO (para rutinas de seed)
-- ============================================================
-- Insertar usuario de ejemplo en auth.users (requiere rol postgres)
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values (
    '11111111-1111-1111-1111-111111111111',
    'seed@irontrack.app',
    crypt('seed123', gen_salt('bf')),
    now(),
    now(),
    now()
)
on conflict (id) do nothing;

-- Insertar perfil manualmente (si el trigger no está activo)
insert into public.profiles (id, user_id, username, role, created_at, updated_at)
values (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'seed_user',
    'user',
    now(),
    now()
)
on conflict (user_id) do nothing;

-- ============================================================
-- 2. EJERCICIOS (30+ ejercicios aprobados)
-- ============================================================

-- Pecho
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1010000-0000-0000-0000-000000000001', 'Press Banca Plano', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000002', 'Press Banca Inclinado', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000003', 'Press Banca Declinado', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000004', 'Aperturas con Mancuernas', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000005', 'Fondos en Paralelas', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000006', 'Cruces en Polea Baja', null, null, 'approved', now()),
  ('e1010000-0000-0000-0000-000000000007', 'Pullover con Mancuerna', null, null, 'approved', now())
on conflict (id) do nothing;

-- Espalda
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1020000-0000-0000-0000-000000000001', 'Dominadas', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000002', 'Jalón al Pecho', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000003', 'Remo con Barra', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000004', 'Remo con Mancuerna', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000005', 'Remo en Máquina', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000006', 'Pulldown con Agarre Neutro', null, null, 'approved', now()),
  ('e1020000-0000-0000-0000-000000000007', 'Hiperextensiones de Espalda', null, null, 'approved', now())
on conflict (id) do nothing;

-- Piernas
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1030000-0000-0000-0000-000000000001', 'Sentadilla Tradicional', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000002', 'Sentadilla Frontal', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000003', 'Prensa de Piernas', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000004', 'Peso Muerto', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000005', 'Peso Muerto Rumano', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000006', 'Zancadas con Mancuernas', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000007', 'Extensión de Cuádriceps', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000008', 'Curl Femoral Acostado', null, null, 'approved', now()),
  ('e1030000-0000-0000-0000-000000000009', 'Elevación de Talones', null, null, 'approved', now())
on conflict (id) do nothing;

-- Hombros
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1040000-0000-0000-0000-000000000001', 'Press Militar con Barra', null, null, 'approved', now()),
  ('e1040000-0000-0000-0000-000000000002', 'Press Militar con Mancuernas', null, null, 'approved', now()),
  ('e1040000-0000-0000-0000-000000000003', 'Elevaciones Laterales', null, null, 'approved', now()),
  ('e1040000-0000-0000-0000-000000000004', 'Elevaciones Frontales', null, null, 'approved', now()),
  ('e1040000-0000-0000-0000-000000000005', 'Pájaro con Mancuernas', null, null, 'approved', now()),
  ('e1040000-0000-0000-0000-000000000006', 'Face Pull', null, null, 'approved', now())
on conflict (id) do nothing;

-- Brazos
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1050000-0000-0000-0000-000000000001', 'Curl con Barra', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000002', 'Curl con Mancuernas', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000003', 'Curl Martillo', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000004', 'Curl en Banco Scott', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000005', 'Curl en Polea', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000006', 'Press Francés', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000007', 'Extensiones de Tríceps en Polea', null, null, 'approved', now()),
  ('e1050000-0000-0000-0000-000000000008', 'Fondos para Tríceps', null, null, 'approved', now())
on conflict (id) do nothing;

-- Core y Cardio
insert into public.exercises (id, name, image_url, created_by, status, created_at) values
  ('e1060000-0000-0000-0000-000000000001', 'Crunch Abdominal', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000002', 'Plancha Frontal', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000003', 'Elevación de Piernas', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000004', 'Russian Twist', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000005', 'Cinta de Correr', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000006', 'Bicicleta Estática', null, null, 'approved', now()),
  ('e1060000-0000-0000-0000-000000000007', 'Elíptica', null, null, 'approved', now())
on conflict (id) do nothing;

-- ============================================================
-- 3. RUTINAS DE EJEMPLO
-- ============================================================

-- Variables locales para IDs de usuario
-- Se usa el UUID fijo del usuario de seed

-- Rutina 1: Full Body 3 días (para principiantes)
insert into public.routines (id, user_id, name, is_active, is_public, likes_count, created_at, updated_at)
values (
    'r1010000-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Full Body 3 días',
    false,
    true,
    0,
    now(),
    now()
)
on conflict (id) do nothing;

-- Días de Rutina 1
insert into public.routine_days (id, routine_id, day_of_week, day_name, order_index, created_at, updated_at)
values
    ('rd1010000-0000-0000-0000-000000000001', 'r1010000-0000-0000-0000-000000000001', 0, 'Día A: Empuje', 0, now(), now()),
    ('rd1010000-0000-0000-0000-000000000002', 'r1010000-0000-0000-0000-000000000001', 2, 'Día B: Tirón', 1, now(), now()),
    ('rd1010000-0000-0000-0000-000000000003', 'r1010000-0000-0000-0000-000000000001', 4, 'Día C: Piernas', 2, now(), now())
on conflict (id) do nothing;

-- Ejercicios Día A: Empuje
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1010000-0000-0000-0000-000000000001', 'rd1010000-0000-0000-0000-000000000001', 'e1010000-0000-0000-0000-000000000001', 0, 4, '8-12', 'Controlar descenso', now(), now()),
    ('re1010000-0000-0000-0000-000000000002', 'rd1010000-0000-0000-0000-000000000001', 'e1040000-0000-0000-0000-000000000001', 1, 4, '8-12', null, now(), now()),
    ('re1010000-0000-0000-0000-000000000003', 'rd1010000-0000-0000-0000-000000000001', 'e1050000-0000-0000-0000-000000000006', 2, 3, '10-12', null, now(), now()),
    ('re1010000-0000-0000-0000-000000000004', 'rd1010000-0000-0000-0000-000000000001', 'e1060000-0000-0000-0000-000000000002', 3, 3, '60s', 'Plancha isométrica', now(), now())
on conflict (id) do nothing;

-- Ejercicios Día B: Tirón
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1010000-0000-0000-0000-000000000005', 'rd1010000-0000-0000-0000-000000000002', 'e1020000-0000-0000-0000-000000000002', 0, 4, '8-12', null, now(), now()),
    ('re1010000-0000-0000-0000-000000000006', 'rd1010000-0000-0000-0000-000000000002', 'e1020000-0000-0000-0000-000000000004', 1, 4, '8-12', 'Cada brazo', now(), now()),
    ('re1010000-0000-0000-0000-000000000007', 'rd1010000-0000-0000-0000-000000000002', 'e1050000-0000-0000-0000-000000000002', 2, 3, '10-12', null, now(), now()),
    ('re1010000-0000-0000-0000-000000000008', 'rd1010000-0000-0000-0000-000000000002', 'e1060000-0000-0000-0000-000000000001', 3, 3, '15-20', null, now(), now())
on conflict (id) do nothing;

-- Ejercicios Día C: Piernas
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1010000-0000-0000-0000-000000000009', 'rd1010000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000001', 0, 4, '8-12', 'Profundidad completa', now(), now()),
    ('re1010000-0000-0000-0000-000000000010', 'rd1010000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000004', 1, 4, '5-8', 'Peso pesado', now(), now()),
    ('re1010000-0000-0000-0000-000000000011', 'rd1010000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000007', 2, 3, '10-15', null, now(), now()),
    ('re1010000-0000-0000-0000-000000000012', 'rd1010000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000008', 3, 3, '10-15', null, now(), now())
on conflict (id) do nothing;

-- Rutina 2: Upper/Lower Split (intermedio)
insert into public.routines (id, user_id, name, is_active, is_public, likes_count, created_at, updated_at)
values (
    'r1010000-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'Upper/Lower Split',
    false,
    true,
    0,
    now(),
    now()
)
on conflict (id) do nothing;

-- Días de Rutina 2
insert into public.routine_days (id, routine_id, day_of_week, day_name, order_index, created_at, updated_at)
values
    ('rd1020000-0000-0000-0000-000000000001', 'r1010000-0000-0000-0000-000000000002', 0, 'Upper', 0, now(), now()),
    ('rd1020000-0000-0000-0000-000000000002', 'r1010000-0000-0000-0000-000000000002', 1, 'Lower', 1, now(), now()),
    ('rd1020000-0000-0000-0000-000000000003', 'r1010000-0000-0000-0000-000000000002', 3, 'Upper', 2, now(), now()),
    ('rd1020000-0000-0000-0000-000000000004', 'r1010000-0000-0000-0000-000000000002', 4, 'Lower', 3, now(), now())
on conflict (id) do nothing;

-- Ejercicios Upper 1
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1020000-0000-0000-0000-000000000001', 'rd1020000-0000-0000-0000-000000000001', 'e1010000-0000-0000-0000-000000000001', 0, 4, '6-8', 'Pesado', now(), now()),
    ('re1020000-0000-0000-0000-000000000002', 'rd1020000-0000-0000-0000-000000000001', 'e1020000-0000-0000-0000-000000000002', 1, 4, '8-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000003', 'rd1020000-0000-0000-0000-000000000001', 'e1040000-0000-0000-0000-000000000001', 2, 3, '8-10', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000004', 'rd1020000-0000-0000-0000-000000000001', 'e1050000-0000-0000-0000-000000000006', 3, 3, '10-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000005', 'rd1020000-0000-0000-0000-000000000001', 'e1040000-0000-0000-0000-000000000003', 4, 3, '12-15', 'Quemar', now(), now())
on conflict (id) do nothing;

-- Ejercicios Lower 1
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1020000-0000-0000-0000-000000000006', 'rd1020000-0000-0000-0000-000000000002', 'e1030000-0000-0000-0000-000000000001', 0, 4, '6-8', 'Pesado', now(), now()),
    ('re1020000-0000-0000-0000-000000000007', 'rd1020000-0000-0000-0000-000000000002', 'e1030000-0000-0000-0000-000000000004', 1, 4, '5-8', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000008', 'rd1020000-0000-0000-0000-000000000002', 'e1030000-0000-0000-0000-000000000006', 2, 3, '10-12', 'Cada pierna', now(), now()),
    ('re1020000-0000-0000-0000-000000000009', 'rd1020000-0000-0000-0000-000000000002', 'e1030000-0000-0000-0000-000000000009', 3, 4, '12-20', 'Gemelos', now(), now())
on conflict (id) do nothing;

-- Ejercicios Upper 2
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1020000-0000-0000-0000-000000000010', 'rd1020000-0000-0000-0000-000000000003', 'e1010000-0000-0000-0000-000000000002', 0, 4, '8-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000011', 'rd1020000-0000-0000-0000-000000000003', 'e1020000-0000-0000-0000-000000000003', 1, 4, '8-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000012', 'rd1020000-0000-0000-0000-000000000003', 'e1040000-0000-0000-0000-000000000002', 2, 3, '8-10', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000013', 'rd1020000-0000-0000-0000-000000000003', 'e1050000-0000-0000-0000-000000000007', 3, 3, '10-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000014', 'rd1020000-0000-0000-0000-000000000003', 'e1040000-0000-0000-0000-000000000005', 4, 3, '12-15', 'Pájaro', now(), now())
on conflict (id) do nothing;

-- Ejercicios Lower 2
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1020000-0000-0000-0000-000000000015', 'rd1020000-0000-0000-0000-000000000004', 'e1030000-0000-0000-0000-000000000003', 0, 4, '8-12', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000016', 'rd1020000-0000-0000-0000-000000000004', 'e1030000-0000-0000-0000-000000000005', 1, 4, '8-10', null, now(), now()),
    ('re1020000-0000-0000-0000-000000000017', 'rd1020000-0000-0000-0000-000000000004', 'e1030000-0000-0000-0000-000000000006', 2, 3, '10-12', 'Cada pierna', now(), now()),
    ('re1020000-0000-0000-0000-000000000018', 'rd1020000-0000-0000-0000-000000000004', 'e1030000-0000-0000-0000-000000000009', 3, 4, '12-20', 'Gemelos', now(), now())
on conflict (id) do nothing;

-- Rutina 3: Push/Pull/Legs (avanzado)
insert into public.routines (id, user_id, name, is_active, is_public, likes_count, created_at, updated_at)
values (
    'r1010000-0000-0000-0000-000000000003',
    '11111111-1111-1111-1111-111111111111',
    'Push/Pull/Legs',
    false,
    true,
    0,
    now(),
    now()
)
on conflict (id) do nothing;

-- Días de Rutina 3
insert into public.routine_days (id, routine_id, day_of_week, day_name, order_index, created_at, updated_at)
values
    ('rd1030000-0000-0000-0000-000000000001', 'r1010000-0000-0000-0000-000000000003', 0, 'Push', 0, now(), now()),
    ('rd1030000-0000-0000-0000-000000000002', 'r1010000-0000-0000-000000000003', 1, 'Pull', 1, now(), now()),
    ('rd1030000-0000-0000-0000-000000000003', 'r1010000-0000-0000-000000000003', 2, 'Legs', 2, now(), now()),
    ('rd1030000-0000-0000-0000-000000000004', 'r1010000-0000-0000-000000000003', 4, 'Push', 3, now(), now()),
    ('rd1030000-0000-0000-0000-000000000005', 'r1010000-0000-0000-000000000003', 5, 'Pull', 4, now(), now()),
    ('rd1030000-0000-0000-0000-000000000006', 'r1010000-0000-0000-000000000003', 6, 'Legs', 5, now(), now())
on conflict (id) do nothing;

-- Ejercicios Push
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1030000-0000-0000-0000-000000000001', 'rd1030000-0000-0000-0000-000000000001', 'e1010000-0000-0000-0000-000000000001', 0, 4, '6-8', 'Pesado', now(), now()),
    ('re1030000-0000-0000-0000-000000000002', 'rd1030000-0000-0000-0000-000000000001', 'e1040000-0000-0000-0000-000000000001', 1, 4, '8-10', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000003', 'rd1030000-0000-0000-0000-000000000001', 'e1010000-0000-0000-0000-000000000005', 2, 3, '8-12', 'Fondos', now(), now()),
    ('re1030000-0000-0000-0000-000000000004', 'rd1030000-0000-0000-0000-000000000001', 'e1050000-0000-0000-0000-000000000006', 3, 3, '10-12', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000005', 'rd1030000-0000-0000-0000-000000000001', 'e1040000-0000-0000-0000-000000000003', 4, 3, '12-15', 'Lateral', now(), now())
on conflict (id) do nothing;

-- Ejercicios Pull
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1030000-0000-0000-0000-000000000006', 'rd1030000-0000-0000-0000-000000000002', 'e1020000-0000-0000-0000-000000000002', 0, 4, '8-12', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000007', 'rd1030000-0000-0000-0000-000000000002', 'e1020000-0000-0000-0000-000000000003', 1, 4, '6-8', 'Barra', now(), now()),
    ('re1030000-0000-0000-0000-000000000008', 'rd1030000-0000-0000-0000-000000000002', 'e1050000-0000-0000-0000-000000000002', 2, 3, '10-12', 'Bíceps', now(), now()),
    ('re1030000-0000-0000-0000-000000000009', 'rd1030000-0000-0000-0000-000000000002', 'e1050000-0000-0000-0000-000000000003', 3, 3, '10-12', 'Martillo', now(), now()),
    ('re1030000-0000-0000-0000-000000000010', 'rd1030000-0000-0000-0000-000000000002', 'e1040000-0000-0000-0000-000000000005', 4, 3, '12-15', 'Pájaro', now(), now())
on conflict (id) do nothing;

-- Ejercicios Legs
insert into public.routine_exercises (id, routine_day_id, exercise_id, order_index, suggested_sets, suggested_reps, notes, created_at, updated_at)
values
    ('re1030000-0000-0000-0000-000000000011', 'rd1030000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000001', 0, 4, '6-8', 'Pesado', now(), now()),
    ('re1030000-0000-0000-0000-000000000012', 'rd1030000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000004', 1, 4, '5-8', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000013', 'rd1030000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000007', 2, 3, '10-15', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000014', 'rd1030000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000008', 3, 3, '10-15', null, now(), now()),
    ('re1030000-0000-0000-0000-000000000015', 'rd1030000-0000-0000-0000-000000000003', 'e1030000-0000-0000-0000-000000000009', 4, 4, '12-20', 'Gemelos', now(), now())
on conflict (id) do nothing;

-- ============================================================
-- FIN DEL SEED
-- ============================================================
