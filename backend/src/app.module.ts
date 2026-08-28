import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [PlayersModule, AuthModule, ExercisesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
