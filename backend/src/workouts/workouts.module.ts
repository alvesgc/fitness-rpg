import { Module } from '@nestjs/common';

import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

import { PrismaService } from '../../prisma/prisma.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],

  controllers: [WorkoutsController],

  providers: [WorkoutsService, PrismaService],
})
export class WorkoutsModule {}
