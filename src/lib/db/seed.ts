/*
 * Seed script para IRON TRACK.
 * Inserta 30+ ejercicios categorizados y 3 rutinas de ejemplo
 * usando los repositories existentes.
 *
 * Los datos de rutinas coinciden exactamente con seed.sql.
 * El exerciseId se resuelve en tiempo de ejecución buscando por nombre.
 */

import type { DbClient } from '@/lib/db/types'
import * as exerciseRepo from '@/lib/repositories/exerciseRepository'
import * as routineRepo from '@/lib/repositories/routineRepository'
import * as profileRepo from '@/lib/repositories/profileRepository'
import { ValidationError } from '@/lib/utils/errors'

/* ─────────── Tipos locales para seed ─────────── */

/**
 * Ejercicio de rutina sin exerciseId — se resuelve en tiempo de ejecución
 * buscando el nombre en el mapa de ejercicios creados/existentes.
 */
interface SeedExerciseInput {
    orderIndex: number
    suggestedSets: number
    suggestedReps: string
    notes: string | null
}

interface SeedDayInput {
    dayOfWeek: number
    dayName: string
    orderIndex: number
    exercises: SeedExerciseInput[]
}

/* ─────────── Datos de seed ─────────── */

const EXERCISES_BY_CATEGORY: Record<string, string[]> = {
    Pecho: [
        'Press Banca Plano',
        'Press Banca Inclinado',
        'Press Banca Declinado',
        'Aperturas con Mancuernas',
        'Fondos en Paralelas',
        'Cruces en Polea Baja',
        'Pullover con Mancuerna',
    ],
    Espalda: [
        'Dominadas',
        'Jalón al Pecho',
        'Remo con Barra',
        'Remo con Mancuerna',
        'Remo en Máquina',
        'Pulldown con Agarre Neutro',
        'Hiperextensiones de Espalda',
    ],
    Piernas: [
        'Sentadilla Tradicional',
        'Sentadilla Frontal',
        'Prensa de Piernas',
        'Peso Muerto',
        'Peso Muerto Rumano',
        'Zancadas con Mancuernas',
        'Extensión de Cuádriceps',
        'Curl Femoral Acostado',
        'Elevación de Talones',
    ],
    Hombros: [
        'Press Militar con Barra',
        'Press Militar con Mancuernas',
        'Elevaciones Laterales',
        'Elevaciones Frontales',
        'Pájaro con Mancuernas',
        'Face Pull',
    ],
    Brazos: [
        'Curl con Barra',
        'Curl con Mancuernas',
        'Curl Martillo',
        'Curl en Banco Scott',
        'Curl en Polea',
        'Press Francés',
        'Extensiones de Tríceps en Polea',
        'Fondos para Tríceps',
    ],
    'Core y Cardio': [
        'Crunch Abdominal',
        'Plancha Frontal',
        'Elevación de Piernas',
        'Russian Twist',
        'Cinta de Correr',
        'Bicicleta Estática',
        'Elíptica',
    ],
}

const R2_PUBLIC_BASE = 'https://pub-aa0db9342631451289ced5c0b814cf9f.r2.dev'

const ADMIN_USER_ID = '22222222-2222-2222-2222-222222222222'

const EXERCISE_MEDIA: {
    name: string
    type: 'image' | 'video'
    url: string
    orderIndex: number
}[] = [
    {
        name: 'Press Banca Plano',
        type: 'image',
        url: `${R2_PUBLIC_BASE}/exercises/press-banca-plano.jpg`,
        orderIndex: 0,
    },
    {
        name: 'Press Banca Plano',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=0hvgw1drCh8',
        orderIndex: 1,
    },
    {
        name: 'Sentadilla Tradicional',
        type: 'image',
        url: `${R2_PUBLIC_BASE}/exercises/sentadilla-tradicional.jpg`,
        orderIndex: 0,
    },
    {
        name: 'Dominadas',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8BQJkC9iR5c',
        orderIndex: 0,
    },
]

const EXERCISES: { name: string; category: string }[] = []

for (const [category, names] of Object.entries(EXERCISES_BY_CATEGORY)) {
    for (const name of names) {
        EXERCISES.push({ name, category })
    }
}

/**
 * Definición de rutinas de ejemplo.
 * Coincide exactamente con los datos de seed.sql.
 * El exerciseId no se incluye — se resuelve en tiempo de ejecución por nombre.
 */
const ROUTINES: { name: string; days: SeedDayInput[] }[] = [
    // ─────────── Rutina 1: Full Body 3 días (principiantes) ───────────
    {
        name: 'Full Body 3 días',
        days: [
            {
                dayOfWeek: 0,
                dayName: 'Día A: Empuje',
                orderIndex: 0,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: 'Controlar descenso',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '60s',
                        notes: 'Plancha isométrica',
                    },
                ],
            },
            {
                dayOfWeek: 2,
                dayName: 'Día B: Tirón',
                orderIndex: 1,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: 'Cada brazo',
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '15-20',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 4,
                dayName: 'Día C: Piernas',
                orderIndex: 2,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: 'Profundidad completa',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '5-8',
                        notes: 'Peso pesado',
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                ],
            },
        ],
    },
    // ─────────── Rutina 2: Upper/Lower Split (intermedio) ───────────
    {
        name: 'Upper/Lower Split',
        days: [
            // Upper 1 — Lunes
            {
                dayOfWeek: 0,
                dayName: 'Upper',
                orderIndex: 0,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Quemar',
                    },
                ],
            },
            // Lower 1 — Martes
            {
                dayOfWeek: 1,
                dayName: 'Lower',
                orderIndex: 1,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '5-8',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Cada pierna',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 4,
                        suggestedReps: '12-20',
                        notes: 'Gemelos',
                    },
                ],
            },
            // Upper 2 — Jueves
            {
                dayOfWeek: 3,
                dayName: 'Upper',
                orderIndex: 2,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Pájaro',
                    },
                ],
            },
            // Lower 2 — Viernes
            {
                dayOfWeek: 4,
                dayName: 'Lower',
                orderIndex: 3,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Cada pierna',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 4,
                        suggestedReps: '12-20',
                        notes: 'Gemelos',
                    },
                ],
            },
        ],
    },
    // ─────────── Rutina 3: Push/Pull/Legs (avanzado, 6 días) ───────────
    {
        name: 'Push/Pull/Legs',
        days: [
            // Push 1 — Lunes
            {
                dayOfWeek: 0,
                dayName: 'Push',
                orderIndex: 0,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '8-12',
                        notes: 'Fondos',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Lateral',
                    },
                ],
            },
            // Pull 1 — Martes
            {
                dayOfWeek: 1,
                dayName: 'Pull',
                orderIndex: 1,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Barra',
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Bíceps',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Martillo',
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Pájaro',
                    },
                ],
            },
            // Legs 1 — Miércoles
            {
                dayOfWeek: 2,
                dayName: 'Legs',
                orderIndex: 2,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '5-8',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 4,
                        suggestedReps: '12-20',
                        notes: 'Gemelos',
                    },
                ],
            },
            // Push 2 — Viernes
            {
                dayOfWeek: 4,
                dayName: 'Push',
                orderIndex: 3,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '8-12',
                        notes: 'Fondos',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Lateral',
                    },
                ],
            },
            // Pull 2 — Sábado
            {
                dayOfWeek: 5,
                dayName: 'Pull',
                orderIndex: 4,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '8-12',
                        notes: null,
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Barra',
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Bíceps',
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: 'Martillo',
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: 'Pájaro',
                    },
                ],
            },
            // Legs 2 — Domingo
            {
                dayOfWeek: 6,
                dayName: 'Legs',
                orderIndex: 5,
                exercises: [
                    {
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '5-8',
                        notes: null,
                    },
                    {
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                    {
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-15',
                        notes: null,
                    },
                    {
                        orderIndex: 4,
                        suggestedSets: 4,
                        suggestedReps: '12-20',
                        notes: 'Gemelos',
                    },
                ],
            },
        ],
    },
]

/* ─────────── Ejecución del seed ─────────── */

export async function runSeed(
    db: DbClient,
    seedUserId?: string
): Promise<void> {
    // 1. Insertar ejercicios aprobados (como si fueran creados por un admin o sistema)
    const exerciseMap = new Map<string, string>()

    for (const ex of EXERCISES) {
        const existing = await exerciseRepo.findExerciseByNameLower(db, ex.name)

        if (existing) {
            exerciseMap.set(ex.name, existing.id)
            continue
        }

        const created = await exerciseRepo.createExercise(db, {
            name: ex.name,
            category: ex.category,
            createdBy: seedUserId ?? null,
            status: 'approved',
        })
        exerciseMap.set(ex.name, created.id)
    }

    // 2. Insertar multimedia de ejemplo
    for (const media of EXERCISE_MEDIA) {
        const exerciseId = exerciseMap.get(media.name)

        if (!exerciseId) continue

        const existing = await db
            .from('exercise_media')
            .select('id')
            .eq('exercise_id', exerciseId)
            .eq('url', media.url)
            .maybeSingle()

        if (!existing.data) {
            await db.from('exercise_media').insert({
                exercise_id: exerciseId,
                type: media.type,
                url: media.url,
                order_index: media.orderIndex,
            })
        }
    }

    // 3. Asegurar perfil administrador de prueba
    await ensureAdminProfile(db)

    // 4. Insertar rutinas de ejemplo (si se provee un usuario seed)
    if (!seedUserId) {
        console.log(
            '[seed] Ejercicios insertados. No se insertaron rutinas porque no se proporcionó seedUserId.'
        )

        return
    }

    const profile = await profileRepo.findProfileByUserId(db, seedUserId)

    if (!profile) {
        throw new ValidationError(
            'El usuario seed no tiene perfil. Crea el perfil antes de ejecutar el seed de rutinas.'
        )
    }

    for (const routineDef of ROUTINES) {
        const existingRoutines = await routineRepo.findRoutinesByUser(
            db,
            seedUserId
        )

        if (existingRoutines.some((r) => r.name === routineDef.name)) {
            console.log(
                `[seed] Rutina "${routineDef.name}" ya existe. Saltando.`
            )
            continue
        }

        const routine = await routineRepo.createRoutine(db, {
            userId: seedUserId,
            name: routineDef.name,
            isPublic: true,
        })

        for (const dayDef of routineDef.days) {
            const day = await routineRepo.createRoutineDay(db, {
                routineId: routine.id,
                dayOfWeek: dayDef.dayOfWeek,
                dayName: dayDef.dayName,
                orderIndex: dayDef.orderIndex,
            })

            // Resolver nombres de ejercicios según rutina y día
            const exerciseNames = resolveExerciseNamesForDay(
                routineDef.name,
                dayDef.dayName,
                dayDef.orderIndex
            )

            for (let i = 0; i < exerciseNames.length; i++) {
                const exName = exerciseNames[i]
                const exId = exerciseMap.get(exName)

                if (!exId) continue

                const exerciseData = dayDef.exercises[i]

                await routineRepo.createRoutineExercise(db, {
                    routineDayId: day.id,
                    exerciseId: exId,
                    orderIndex: i,
                    suggestedSets: exerciseData.suggestedSets,
                    suggestedReps: exerciseData.suggestedReps,
                    notes: exerciseData.notes,
                })
            }
        }
    }

    console.log('[seed] Seed completado exitosamente.')
}

/* ─────────── Helpers de asignación de ejercicios ─────────── */

/**
 * Resuelve los nombres de ejercicios que corresponden a cada día de rutina.
 * Los nombres devueltos coinciden exactamente con los ejercicios insertados
 * en seed.sql para cada día.
 */
/**
 * Crea o actualiza el perfil de administrador de seed.
 * Requiere que exista el usuario auth correspondiente en Supabase.
 */
async function ensureAdminProfile(db: DbClient): Promise<void> {
    const existing = await db
        .from('profiles')
        .select('id')
        .eq('id', ADMIN_USER_ID)
        .maybeSingle()

    if (existing.data) {
        await db
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', ADMIN_USER_ID)

        return
    }

    const { error } = await db.from('profiles').insert({
        id: ADMIN_USER_ID,
        username: 'seed_admin',
        role: 'admin',
    })

    if (error) {
        console.warn(
            '[seed] No se pudo crear el perfil admin (¿existe el usuario auth?):',
            error.message
        )
    }
}

function resolveExerciseNamesForDay(
    routineName: string,
    dayName: string,
    orderIndex: number
): string[] {
    const name = routineName.toLowerCase()

    // ─── Full Body 3 días ───
    if (name.includes('full body')) {
        // orderIndex 0 = Día A: Empuje
        if (orderIndex === 0) {
            return [
                'Press Banca Plano',
                'Press Militar con Barra',
                'Press Francés',
                'Plancha Frontal',
            ]
        }
        // orderIndex 1 = Día B: Tirón
        if (orderIndex === 1) {
            return [
                'Jalón al Pecho',
                'Remo con Mancuerna',
                'Curl con Mancuernas',
                'Crunch Abdominal',
            ]
        }
        // orderIndex 2 = Día C: Piernas
        return [
            'Sentadilla Tradicional',
            'Peso Muerto',
            'Extensión de Cuádriceps',
            'Curl Femoral Acostado',
        ]
    }

    // ─── Upper/Lower Split ───
    if (name.includes('upper/lower') || name.includes('upper')) {
        // Upper días: orderIndex 0 y 2
        if (dayName.toLowerCase() === 'upper') {
            // Upper 1 (orderIndex 0) vs Upper 2 (orderIndex 2)
            if (orderIndex === 0) {
                return [
                    'Press Banca Plano',
                    'Jalón al Pecho',
                    'Press Militar con Barra',
                    'Press Francés',
                    'Elevaciones Laterales',
                ]
            }
            return [
                'Press Banca Inclinado',
                'Remo con Barra',
                'Press Militar con Mancuernas',
                'Extensiones de Tríceps en Polea',
                'Pájaro con Mancuernas',
            ]
        }
        // Lower días: orderIndex 1 y 3
        if (orderIndex === 1) {
            return [
                'Sentadilla Tradicional',
                'Peso Muerto',
                'Zancadas con Mancuernas',
                'Elevación de Talones',
            ]
        }
        return [
            'Prensa de Piernas',
            'Peso Muerto Rumano',
            'Zancadas con Mancuernas',
            'Elevación de Talones',
        ]
    }

    // ─── Push/Pull/Legs ───
    if (name.includes('push/pull/legs') || name.includes('push pull legs')) {
        const day = dayName.toLowerCase()

        if (day === 'push') {
            return [
                'Press Banca Plano',
                'Press Militar con Barra',
                'Fondos en Paralelas',
                'Press Francés',
                'Elevaciones Laterales',
            ]
        }
        if (day === 'pull') {
            return [
                'Jalón al Pecho',
                'Remo con Barra',
                'Curl con Mancuernas',
                'Curl Martillo',
                'Pájaro con Mancuernas',
            ]
        }
        if (day === 'legs') {
            return [
                'Sentadilla Tradicional',
                'Peso Muerto',
                'Extensión de Cuádriceps',
                'Curl Femoral Acostado',
                'Elevación de Talones',
            ]
        }
    }

    return ['Sentadilla Tradicional', 'Press Banca Plano', 'Dominadas']
}
