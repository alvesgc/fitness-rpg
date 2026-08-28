import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';

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
}
