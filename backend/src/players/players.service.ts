import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calculateProgression } from '../commom/progression/progression';
import { calculateRank } from '../commom/ranking/ranking';
import { AddXpDto } from './dto/add-xp.dto';

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPlayer() {
    return this.prisma.user.create({
      data: {
        name: 'Alissongcw',
        email: 'alisson@testando.com',

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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        profile: true,
      },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Player not found');
    }

    const progression = calculateProgression(user.profile.totalXp);

    const rank = calculateRank(user.profile.totalXp);

    return {
      id: user.id,
      name: user.name,

      progression: {
        level: progression.level,
        totalXp: user.profile.totalXp,
        currentXp: progression.currentXp,
        xpToNextLevel: progression.xpToNextLevel,
        progress: progression.progress,
      },

      rank,

      streak: user.profile.currentStreak,
    };
  }
  async addXp(id: string, dto: AddXpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Player not found');
    }

    await this.prisma.xPTransaction.create({
      data: {
        userId: id,
        amount: dto.amount,
        type: dto.type,
        description: dto.description,
      },
    });

    const updatedProfile = await this.prisma.playerProfile.update({
      where: {
        userId: id,
      },

      data: {
        totalXp: {
          increment: dto.amount,
        },
      },
    });

    const progression = calculateProgression(updatedProfile.totalXp);

    const rank = calculateRank(updatedProfile.totalXp);

    return {
      totalXp: updatedProfile.totalXp,
      progression,
      rank,
    };
  }
}
