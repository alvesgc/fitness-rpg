import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class RegisterSetDto {
  @IsString()
  exerciseId!: string;

  @IsInt()
  @Min(1)
  setNumber!: number;

  @IsNumber()
  @Min(0)
  weight!: number;

  @IsInt()
  @Min(1)
  repetitions!: number;
}
