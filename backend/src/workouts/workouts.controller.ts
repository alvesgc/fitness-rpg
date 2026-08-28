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
import { RegisterSetDto } from './dto/register-set.dto';

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
  @Get('sessions/:sessionId')
  getSession(@Req() request: Request, @Param('sessionId') sessionId: string) {
    const user = request['user'];

    return this.workoutsService.getSession(user.sub, sessionId);
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
  @Post(':id/start')
  startSession(@Req() request: Request, @Param('id') workoutId: string) {
    const user = request['user'];

    return this.workoutsService.startSession(user.sub, workoutId);
  }
  @Post('sessions/:sessionId/sets')
  registerSet(
    @Req() request: Request,
    @Param('sessionId') sessionId: string,
    @Body() dto: RegisterSetDto,
  ) {
    const user = request['user'];

    return this.workoutsService.registerSet(user.sub, sessionId, dto);
  }
  @Post('sessions/:sessionId/finish')
  finishSession(
    @Req() request: Request,
    @Param('sessionId') sessionId: string,
  ) {
    const user = request['user'];

    return this.workoutsService.finishSession(user.sub, sessionId);
  }
}
