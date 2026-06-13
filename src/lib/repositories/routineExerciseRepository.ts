import { getServerClient } from '@/lib/db/client.ts';
import type { RoutineExercise } from '@/lib/models/index.ts';
import { AppError, NotFoundError } from '@/lib/utils/errors.ts';
import { mapToCamelCase, mapArrayToCamelCase, mapToSnakeCase } from '@/lib/utils/map-keys.ts';

export const routineExerciseRepository = {
  async findByRoutineDayId(routineDayId: string): Promise<RoutineExercise[]> {
    const client = getServerClient();
    const { data, error } = await client
      .from('routine_exercises')
      .select('*')
      .eq('routine_day_id', routineDayId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new AppError(error.message, 500);
    }

    return mapArrayToCamelCase<RoutineExercise>(data || []);
  },

  async create(routineExercise: Partial<RoutineExercise>): Promise<RoutineExercise> {
    const client = getServerClient();
    const payload = mapToSnakeCase(routineExercise as Record<string, unknown>);
    const { data, error } = await client
      .from('routine_exercises')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(error?.message || 'Error al crear el ejercicio de rutina', 500);
    }

    return mapToCamelCase<RoutineExercise>(data);
  },

  async update(id: string, data: Partial<RoutineExercise>): Promise<RoutineExercise> {
    const client = getServerClient();
    const payload = mapToSnakeCase(data as Record<string, unknown>);
    const { data: updated, error } = await client
      .from('routine_exercises')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new NotFoundError('RoutineExercise');
    }

    return mapToCamelCase<RoutineExercise>(updated);
  },

  async deleteByRoutineDayId(routineDayId: string): Promise<void> {
    const client = getServerClient();
    const { error } = await client
      .from('routine_exercises')
      .delete()
      .eq('routine_day_id', routineDayId);

    if (error) {
      throw new AppError(error.message, 500);
    }
  },
};
