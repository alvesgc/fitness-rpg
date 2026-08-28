import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId!: string;

  @IsInt()
  @Min(1)
  sets!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minReps?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxReps?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  restSeconds?: number;
}
