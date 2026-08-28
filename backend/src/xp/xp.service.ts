import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    let profile = await this.prisma.playerProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      profile = await this.prisma.playerProfile.create({
        data: {
          userId,
        },
      });
    }

    return profile;
  }

  async addXp(
    userId: string,
    amount: number,
    type: string,
    description: string,
  ) {
    const profile = await this.getProfile(userId);

    const transaction = await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    });

    const updatedProfile = await this.prisma.playerProfile.update({
      where: {
        userId,
      },

      data: {
        totalXp: {
          increment: amount,
        },
      },
    });

    return {
      profile: updatedProfile,
      transaction,
    };
  }
  getRequiredXpForNextLevel(level: number) {
    return 500 * level;
  }
  getLevelFromXp(totalXp: number) {
    let level = 1;
    let xpSpent = 0;

    while (totalXp >= xpSpent + this.getRequiredXpForNextLevel(level)) {
      xpSpent += this.getRequiredXpForNextLevel(level);
      level++;
    }

    return level;
  }
  async getStatus(userId: string) {
    const profile = await this.getProfile(userId);

    const level = this.getLevelFromXp(profile.totalXp);

    let currentLevelXp = 0;

    for (let currentLevel = 1; currentLevel < level; currentLevel++) {
      currentLevelXp += this.getRequiredXpForNextLevel(currentLevel);
    }

    const nextLevelXp = currentLevelXp + this.getRequiredXpForNextLevel(level);

    const xpInLevel = profile.totalXp - currentLevelXp;

    const xpNeeded = nextLevelXp - currentLevelXp;

    const progress = Math.floor((xpInLevel / xpNeeded) * 100);

    return {
      totalXp: profile.totalXp,
      level,
      currentLevelXp,
      nextLevelXp,
      xpInLevel,
      xpNeeded,
      progress,
      currentStreak: profile.currentStreak,
    };
  }
}
