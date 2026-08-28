export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
  description?: string;
  instructions?: string;
  videoUrl?: string;
}

export interface WorkoutExercise {
  id: string;
  order: number;
  sets: number;
  minReps?: number;
  maxReps?: number;
  restSeconds?: number;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startedAt: string;
  completedAt?: string;
  sets?: WorkoutSet[];
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  repetitions: number;
  completedAt: string;
}
