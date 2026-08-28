import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { WorkoutsService } from './workouts.service';

import { CreateWorkoutDto } from './dto/create-workout.dto';
import { AddExerciseDto } from './dto/add-exercise.dto';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Req() request: Request, @Body() dto: CreateWorkoutDto) {
    const user = request['user'];

    return this.workoutsService.create(user.sub, dto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const user = request['user'];

    return this.workoutsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') workoutId: string) {
    const user = request['user'];

    return this.workoutsService.findOne(user.sub, workoutId);
  }

  @Post(':id/exercises')
  addExercise(
    @Req() request: Request,
    @Param('id') workoutId: string,
    @Body() dto: AddExerciseDto,
  ) {
    const user = request['user'];

    return this.workoutsService.addExercise(user.sub, workoutId, dto);
  }

  @Delete(':id/exercises/:exerciseId')
  removeExercise(
    @Req() request: Request,
    @Param('id') workoutId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    const user = request['user'];

    return this.workoutsService.removeExercise(user.sub, workoutId, exerciseId);
  }
}
