import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PlayersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
