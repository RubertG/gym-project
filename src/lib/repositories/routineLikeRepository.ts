import { getServerClient } from '@/lib/db/client.ts';
import type { RoutineLike } from '@/lib/models/index.ts';
import { AppError } from '@/lib/utils/errors.ts';
import { mapToCamelCase, mapArrayToCamelCase, mapToSnakeCase } from '@/lib/utils/map-keys.ts';

export const routineLikeRepository = {
  async findByRoutineId(routineId: string): Promise<RoutineLike[]> {
    const client = getServerClient();
    const { data, error } = await client
      .from('routine_likes')
      .select('*')
      .eq('routine_id', routineId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(error.message, 500);
    }

    return mapArrayToCamelCase<RoutineLike>(data || []);
  },

  async findByUserAndRoutine(userId: string, routineId: string): Promise<RoutineLike | null> {
    const client = getServerClient();
    const { data, error } = await client
      .from('routine_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('routine_id', routineId)
      .single();

    if (error) {
      throw new AppError(error.message, 500);
    }

    if (!data) return null;
    return mapToCamelCase<RoutineLike>(data);
  },

  async create(like: Partial<RoutineLike>): Promise<RoutineLike> {
    const client = getServerClient();
    const payload = mapToSnakeCase(like as Record<string, unknown>);
    const { data, error } = await client
      .from('routine_likes')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new AppError(error?.message || 'Error al crear el like', 500);
    }

    return mapToCamelCase<RoutineLike>(data);
  },

  async delete(userId: string, routineId: string): Promise<void> {
    const client = getServerClient();
    const { error } = await client
      .from('routine_likes')
      .delete()
      .eq('user_id', userId)
      .eq('routine_id', routineId);

    if (error) {
      throw new AppError(error.message, 500);
    }
  },
};
