import { create } from 'zustand';
import type { WorkoutSession, WorkoutSet } from '../models';

interface WorkoutExerciseState {
  exerciseId: string;
  sets: WorkoutSet[];
}

interface WorkoutState {
  session: WorkoutSession | null;
  activeExercises: WorkoutExerciseState[];
  currentExerciseIndex: number;
  isResting: boolean;
  restSeconds: number;
  // Actions (placeholders)
  startSession: (session: WorkoutSession) => void;
  addSet: (exerciseId: string, set: WorkoutSet) => void;
  completeExercise: (exerciseId: string) => void;
  finishSession: () => void;
  startRest: (seconds: number) => void;
  stopRest: () => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  session: null,
  activeExercises: [],
  currentExerciseIndex: 0,
  isResting: false,
  restSeconds: 0,

  startSession: (session) =>
    set({ session, activeExercises: [], currentExerciseIndex: 0 }),

  addSet: (exerciseId, workoutSet) =>
    set((state) => {
      const exercises = [...state.activeExercises];
      const idx = exercises.findIndex((e) => e.exerciseId === exerciseId);
      if (idx >= 0) {
        exercises[idx] = {
          ...exercises[idx],
          sets: [...exercises[idx].sets, workoutSet],
        };
      } else {
        exercises.push({ exerciseId, sets: [workoutSet] });
      }
      return { activeExercises: exercises };
    }),

  completeExercise: () =>
    set((state) => ({
      currentExerciseIndex: state.currentExerciseIndex + 1,
    })),

  finishSession: () =>
    set({
      session: null,
      activeExercises: [],
      currentExerciseIndex: 0,
      isResting: false,
      restSeconds: 0,
    }),

  startRest: (seconds) => set({ isResting: true, restSeconds: seconds }),
  stopRest: () => set({ isResting: false, restSeconds: 0 }),

  reset: () =>
    set({
      session: null,
      activeExercises: [],
      currentExerciseIndex: 0,
      isResting: false,
      restSeconds: 0,
    }),
}));
