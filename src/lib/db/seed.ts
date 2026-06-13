/*
 * Seed script para IRON TRACK.
 * Inserta 30+ ejercicios categorizados y 2-3 rutinas de ejemplo
 * usando los repositories existentes.
 */

import type { DbClient } from '@/lib/db/types';
import * as exerciseRepo from '@/lib/repositories/exerciseRepository';
import * as routineRepo from '@/lib/repositories/routineRepository';
import * as profileRepo from '@/lib/repositories/profileRepository';
import { ValidationError } from '@/lib/utils/errors';
import type { RoutineDayInput } from '@/lib/models';

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
};

const EXERCISES: { name: string; category: string }[] = [];

for (const [category, names] of Object.entries(EXERCISES_BY_CATEGORY)) {
    for (const name of names) {
        EXERCISES.push({ name, category });
    }
}

const ROUTINES: { name: string; days: RoutineDayInput[] }[] = [
    {
        name: 'Full Body 3 días',
        days: [
            {
                dayOfWeek: 0,
                dayName: 'Lunes - Full Body A',
                orderIndex: 0,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 2,
                dayName: 'Miércoles - Full Body B',
                orderIndex: 1,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 4,
                dayName: 'Viernes - Full Body C',
                orderIndex: 2,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: 'Pesado',
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                ],
            },
        ],
    },
    {
        name: 'Upper / Lower',
        days: [
            {
                dayOfWeek: 0,
                dayName: 'Lunes - Upper',
                orderIndex: 0,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 1,
                dayName: 'Martes - Lower',
                orderIndex: 1,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 3,
                dayName: 'Jueves - Upper',
                orderIndex: 2,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 4,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 4,
                dayName: 'Viernes - Lower',
                orderIndex: 3,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
        ],
    },
    {
        name: 'Push Pull Legs',
        days: [
            {
                dayOfWeek: 0,
                dayName: 'Lunes - Push',
                orderIndex: 0,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 1,
                dayName: 'Martes - Pull',
                orderIndex: 1,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 4,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
            {
                dayOfWeek: 2,
                dayName: 'Miércoles - Legs',
                orderIndex: 2,
                exercises: [
                    {
                        exerciseId: '',
                        orderIndex: 0,
                        suggestedSets: 4,
                        suggestedReps: '6-8',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 1,
                        suggestedSets: 3,
                        suggestedReps: '8-10',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 2,
                        suggestedSets: 3,
                        suggestedReps: '10-12',
                        notes: null,
                    },
                    {
                        exerciseId: '',
                        orderIndex: 3,
                        suggestedSets: 3,
                        suggestedReps: '12-15',
                        notes: null,
                    },
                ],
            },
        ],
    },
];

/* ─────────── Ejecución del seed ─────────── */

export async function runSeed(
    db: DbClient,
    seedUserId?: string
): Promise<void> {
    // 1. Insertar ejercicios aprobados (como si fueran creados por un admin o sistema)
    const exerciseMap = new Map<string, string>();

    for (const ex of EXERCISES) {
        const existing = await exerciseRepo.findExerciseByNameLower(
            db,
            ex.name
        );

        if (existing) {
            exerciseMap.set(ex.name, existing.id);
            continue;
        }

        const created = await exerciseRepo.createExercise(db, {
            name: ex.name,
            category: ex.category,
            createdBy: seedUserId ?? null,
            status: 'approved',
        });
        exerciseMap.set(ex.name, created.id);
    }

    // 2. Insertar rutinas de ejemplo (si se provee un usuario seed)
    if (!seedUserId) {
        console.log(
            '[seed] Ejercicios insertados. No se insertaron rutinas porque no se proporcionó seedUserId.'
        );

        return;
    }

    const profile = await profileRepo.findProfileByUserId(db, seedUserId);

    if (!profile) {
        throw new ValidationError(
            'El usuario seed no tiene perfil. Crea el perfil antes de ejecutar el seed de rutinas.'
        );
    }

    for (const routineDef of ROUTINES) {
        const existingRoutines = await routineRepo.findRoutinesByUser(
            db,
            seedUserId
        );

        if (existingRoutines.some((r) => r.name === routineDef.name)) {
            console.log(
                `[seed] Rutina "${routineDef.name}" ya existe. Saltando.`
            );
            continue;
        }

        const routine = await routineRepo.createRoutine(db, {
            userId: seedUserId,
            name: routineDef.name,
            isPublic: true,
        });

        for (const dayDef of routineDef.days) {
            const day = await routineRepo.createRoutineDay(db, {
                routineId: routine.id,
                dayOfWeek: dayDef.dayOfWeek,
                dayName: dayDef.dayName,
                orderIndex: dayDef.orderIndex,
            });

            // Asignar ejercicios de ejemplo según el tipo de rutina
            const exerciseNames = resolveExerciseNamesForDay(
                routineDef.name,
                dayDef.dayName
            );

            for (let i = 0; i < exerciseNames.length; i++) {
                const exName = exerciseNames[i];
                const exId = exerciseMap.get(exName);

                if (!exId) continue;

                await routineRepo.createRoutineExercise(db, {
                    routineDayId: day.id,
                    exerciseId: exId,
                    orderIndex: i,
                    suggestedSets: 3,
                    suggestedReps: '8-12',
                    notes: null,
                });
            }
        }
    }

    console.log('[seed] Seed completado exitosamente.');
}

/* ─────────── Helpers de asignación de ejercicios ─────────── */

function resolveExerciseNamesForDay(
    routineName: string,
    dayName: string
): string[] {
    const name = routineName.toLowerCase();
    const day = dayName.toLowerCase();

    if (name.includes('full body')) {
        if (day.includes('a'))
            return [
                'Sentadilla Tradicional',
                'Press Banca Plano',
                'Dominadas',
                'Press Militar con Barra',
            ];
        if (day.includes('b'))
            return [
                'Peso Muerto',
                'Press Banca Inclinado',
                'Remo con Barra',
                'Elevaciones Laterales',
            ];
        return [
            'Sentadilla Frontal',
            'Aperturas con Mancuernas',
            'Jalón al Pecho',
            'Curl con Barra',
        ];
    }

    if (name.includes('upper')) {
        if (day.includes('upper'))
            return [
                'Press Banca Plano',
                'Dominadas',
                'Press Militar con Barra',
                'Elevaciones Laterales',
                'Extensiones de Tríceps en Polea',
            ];
        return [
            'Sentadilla Tradicional',
            'Peso Muerto Rumano',
            'Prensa de Piernas',
            'Curl Femoral Acostado',
        ];
    }

    if (name.includes('push')) {
        return [
            'Press Banca Plano',
            'Press Banca Inclinado',
            'Elevaciones Laterales',
            'Extensiones de Tríceps en Polea',
        ];
    }
    if (name.includes('pull')) {
        return ['Dominadas', 'Remo con Barra', 'Curl con Barra', 'Face Pull'];
    }
    if (name.includes('leg')) {
        return [
            'Sentadilla Tradicional',
            'Peso Muerto',
            'Prensa de Piernas',
            'Peso Muerto Rumano',
        ];
    }

    return ['Sentadilla Tradicional', 'Press Banca Plano', 'Dominadas'];
}
