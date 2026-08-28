import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateExerciseDto } from '../auth/dto/create-exercise.dto';
import { UpdateExerciseDto } from '../auth/dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: {
        name: dto.name,
        muscleGroup: dto.muscleGroup,
        equipment: dto.equipment,
        description: dto.description,
        instructions: dto.instructions,
        videoUrl: dto.videoUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async update(id: string, dto: UpdateExerciseDto) {
    await this.findOne(id);

    return this.prisma.exercise.update({
      where: {
        id,
      },

      data: {
        ...dto,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.exercise.delete({
      where: {
        id,
      },
    });
  }
}
