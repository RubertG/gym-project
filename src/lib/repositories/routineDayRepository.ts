import { getServerClient } from '@/lib/db/client.ts';
import type { RoutineDay } from '@/lib/models/index.ts';
import { AppError, NotFoundError } from '@/lib/utils/errors.ts';
import { mapToCamelCase, mapArrayToCamelCase, mapToSnakeCase } from '@/lib/utils/map-keys.ts';

export const routineDayRepository = {
  async findByRoutineId(routineId: string): Promise<RoutineDay[]> {
    const client = getServerClient();
    const { data, error } = await client
      .from('routine_days')
      .select('*')
      .eq('routine_id', routineId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new AppError(error.message, 500);
    }

    return mapArrayToCamelCase<RoutineDay>(data || []);
  },

  async create(day: Partial<RoutineDay>): Promise<RoutineDay> {
    const client = getServerClient();
    const payload = mapToSnakeCase(day as Record<string, unknown>);
    const { data, error } = await client
      .from('routine_days')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(error?.message || 'Error al crear el día de rutina', 500);
    }

    return mapToCamelCase<RoutineDay>(data);
  },

  async update(id: string, data: Partial<RoutineDay>): Promise<RoutineDay> {
    const client = getServerClient();
    const payload = mapToSnakeCase(data as Record<string, unknown>);
    const { data: updated, error } = await client
      .from('routine_days')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      throw new NotFoundError('RoutineDay');
    }

    return mapToCamelCase<RoutineDay>(updated);
  },

  async deleteByRoutineId(routineId: string): Promise<void> {
    const client = getServerClient();
    const { error } = await client
      .from('routine_days')
      .delete()
      .eq('routine_id', routineId);

    if (error) {
      throw new AppError(error.message, 500);
    }
  },
};
