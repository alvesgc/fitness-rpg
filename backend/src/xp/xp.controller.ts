import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { XpService } from './xp.service';

@Controller('xp')
@UseGuards(JwtAuthGuard)
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get('status')
  getStatus(@Req() request: Request) {
    const user = request['user'];

    return this.xpService.getStatus(user.sub);
  }
}
