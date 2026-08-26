import { Controller, Post, Get, Param, } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  createPlayer() {
    return this.playersService.createPlayer();
  }
  @Get(':id')
  findPlayer(@Param('id') id: string) {
    return this.playersService.findPlayer(id);
  }
}
