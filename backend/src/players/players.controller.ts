import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth//guards/jwt-auth.guard';
import { AddXpDto } from './dto/add-xp.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  createPlayer() {
    return this.playersService.createPlayer();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() request: Request) {
    const user = request['user'];

    return this.playersService.findPlayer(user.sub);
  }

  @Get(':id')
  findPlayer(@Param('id') id: string) {
    return this.playersService.findPlayer(id);
  }

  @Post(':id/xp')
  addXp(@Param('id') id: string, @Body() dto: AddXpDto) {
    return this.playersService.addXp(id, dto);
  }
}
