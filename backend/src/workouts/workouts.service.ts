import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';
import { RegisterSetDto } from './dto/register-set.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkoutDto) {
    return this.prisma.workout.create({
      data: {
        name: dto.name,
        description: dto.description,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workout.findMany({
      where: {
        userId,
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },

          orderBy: {
            order: 'asc',
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, workoutId: string) {
    const workout = await this.prisma.workout.findFirst({
      where: {
        id: workoutId,
        userId,
      },

      include: {
        exercises: {
          include: {
            exercise: true,
          },

          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async addExercise(userId: string, workoutId: string, dto: AddExerciseDto) {
    await this.findOne(userId, workoutId);

    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id: dto.exerciseId,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const existing = await this.prisma.workoutExercise.findUnique({
      where: {
        workoutId_exerciseId: {
          workoutId,
          exerciseId: dto.exerciseId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Exercise already exists in this workout');
    }

    const lastExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        workoutId,
      },

      orderBy: {
        order: 'desc',
      },
    });

    const order = lastExercise ? lastExercise.order + 1 : 1;

    return this.prisma.workoutExercise.create({
      data: {
        workoutId,
        exerciseId: dto.exerciseId,
        order,

        sets: dto.sets,
        minReps: dto.minReps,
        maxReps: dto.maxReps,
        restSeconds: dto.restSeconds,
      },

      include: {
        exercise: true,
      },
    });
  }

  async removeExercise(userId: string, workoutId: string, exerciseId: string) {
    await this.findOne(userId, workoutId);

    const workoutExercise = await this.prisma.workoutExercise.findUnique({
      where: {
        workoutId_exerciseId: {
          workoutId,
          exerciseId,
        },
      },
    });

    if (!workoutExercise) {
      throw new NotFoundException('Exercise not found in workout');
    }

    return this.prisma.workoutExercise.delete({
      where: {
        workoutId_exerciseId: {
          workoutId,
          exerciseId,
        },
      },
    });
  }
  async startSession(userId: string, workoutId: string) {
    await this.findOne(userId, workoutId);

    const existingSession = await this.prisma.workoutSession.findFirst({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingSession) {
      throw new BadRequestException('You already have a workout in progress');
    }

    return this.prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        status: 'IN_PROGRESS',
      },

      include: {
        workout: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },

              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
  }
  async registerSet(userId: string, sessionId: string, dto: RegisterSetDto) {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },

      include: {
        workout: {
          include: {
            exercises: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Workout session is not in progress');
    }

    const exerciseInWorkout = session.workout.exercises.find(
      (item) => item.exerciseId === dto.exerciseId,
    );

    if (!exerciseInWorkout) {
      throw new BadRequestException('Exercise does not belong to this workout');
    }

    if (dto.setNumber > exerciseInWorkout.sets) {
      throw new BadRequestException('Set number exceeds planned sets');
    }

    const existingSet = await this.prisma.workoutSet.findFirst({
      where: {
        sessionId,
        exerciseId: dto.exerciseId,
        setNumber: dto.setNumber,
      },
    });

    if (existingSet) {
      throw new BadRequestException('This set has already been registered');
    }

    return this.prisma.workoutSet.create({
      data: {
        sessionId,
        exerciseId: dto.exerciseId,
        setNumber: dto.setNumber,
        weight: dto.weight,
        repetitions: dto.repetitions,
      },

      include: {
        exercise: true,
      },
    });
  }
  async finishSession(userId: string, sessionId: string) {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },

      include: {
        sets: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Workout session is not in progress');
    }

    if (session.sets.length === 0) {
      throw new BadRequestException('Cannot finish an empty workout');
    }

    return this.prisma.workoutSession.update({
      where: {
        id: sessionId,
      },

      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },

      include: {
        workout: true,
        sets: {
          include: {
            exercise: true,
          },
        },
      },
    });
  }
  async getSession(userId: string, sessionId: string) {
    const session = await this.prisma.workoutSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },

      include: {
        workout: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },

              orderBy: {
                order: 'asc',
              },
            },
          },
        },

        sets: {
          include: {
            exercise: true,
          },

          orderBy: [
            {
              exerciseId: 'asc',
            },
            {
              setNumber: 'asc',
            },
          ],
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Workout session not found');
    }

    return session;
  }
}
