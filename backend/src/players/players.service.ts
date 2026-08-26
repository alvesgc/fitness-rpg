import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayer() {
    return this.prisma.user.create({
      data: {
        name: 'Alisson',
        email: 'alisson@example.com',

        profile: {
          create: {
            totalXp: 0,
            currentStreak: 0,
          },
        },
      },

      include: {
        profile: true,
      },
    });
  }

  async findPlayer(id: string) {
    return this.prisma.user.findUnique({
      where: { id}
    })
  }
}
