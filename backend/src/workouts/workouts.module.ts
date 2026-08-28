import { Module } from '@nestjs/common';

import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

import { PrismaService } from '../../prisma/prisma.service';

import { AuthModule } from '../auth/auth.module';

import { XpModule } from '../xp/xp.module';

@Module({
  imports: [AuthModule, XpModule],

  controllers: [WorkoutsController],

  providers: [WorkoutsService, PrismaService],
})
export class WorkoutsModule {}
