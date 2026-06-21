export interface Profile {
    id: string;
    username: string | null;
    avatarUrl: string | null;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface Exercise {
    id: string;
    name: string;
    category: string | null;
    imageUrl: string | null;
    createdBy: string | null;
    status: 'pending' | 'approved';
    createdAt: string;
    deletedAt: string | null;
}

export interface Routine {
    id: string;
    userId: string;
    name: string;
    isActive: boolean;
    isPublic: boolean;
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RoutineDay {
    id: string;
    routineId: string;
    dayOfWeek: number; // 0=Lunes, 6=Domingo
    dayName: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface RoutineExercise {
    id: string;
    routineDayId: string;
    exerciseId: string | null;
    orderIndex: number;
    suggestedSets: number | null;
    suggestedReps: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface WorkoutSession {
    id: string;
    userId: string;
    routineId: string | null;
    routineDayId: string | null;
    sessionDate: string; // ISO date string
    completedAt: string | null;
    note: string | null;
    status: 'draft' | 'completed';
    createdAt: string;
    deletedAt: string | null;
}

export interface WorkoutSet {
    id: string;
    workoutSessionId: string;
    exerciseId: string | null;
    setNumber: number;
    reps: number;
    weightKg: number;
    note: string | null;
    createdAt: string;
    deletedAt: string | null;
}

export interface UserActiveRoutineLog {
    id: string;
    userId: string;
    routineId: string;
    activatedAt: string;
    deactivatedAt: string | null;
    createdAt: string;
    deletedAt: string | null;
}

export interface RoutineLike {
    id: string;
    routineId: string;
    userId: string;
    createdAt: string;
    deletedAt: string | null;
}

export * from './dto'
