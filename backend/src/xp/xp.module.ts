import { Module } from '@nestjs/common';
import { XpController } from './xp.controller';
import { XpService } from './xp.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule], 
  controllers: [XpController],
  providers: [XpService, PrismaService],
  exports: [XpService],
})
export class XpModule {}
