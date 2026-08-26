import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayersService } from './players.service';
import { AddXpDto } from './dto/add-xp.dto';

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

  @Post(':id/xp')
addXp(
  @Param('id') id: string,
  @Body() dto: AddXpDto,
) {
  return this.playersService.addXp(
    id,
    dto,
  )
}
}
