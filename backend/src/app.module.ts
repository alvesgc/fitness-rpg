import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { XpModule } from './xp/xp.module';

@Module({
  imports: [
    PlayersModule,
    AuthModule,
    ExercisesModule,
    WorkoutsModule,
    XpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
