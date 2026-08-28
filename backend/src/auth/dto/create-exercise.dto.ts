import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { MuscleGroup } from '@prisma/client';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(MuscleGroup)
  muscleGroup!: MuscleGroup;

  @IsOptional()
  @IsString()
  equipment?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
