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

  async addXp(
    userId: string,
    amount: number,
    type: string,
    description: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    if (referenceType && referenceId) {
      const existingTransaction = await this.prisma.xPTransaction.findFirst({
        where: {
          userId,
          type,
          referenceType,
          referenceId,
        },
      });

      if (existingTransaction) {
        return {
          transaction: existingTransaction,
          profile: await this.getProfile(userId),
          xpGained: 0,
          leveledUp: false,
        };
      }
    }

    const profile = await this.getProfile(userId);

    const oldLevel = this.getLevelFromXp(profile.totalXp);

    const transaction = await this.prisma.xPTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        referenceType,
        referenceId,
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

    const newLevel = this.getLevelFromXp(updatedProfile.totalXp);

    return {
      profile: updatedProfile,
      transaction,
      xpGained: amount,
      oldLevel,
      newLevel,
      leveledUp: newLevel > oldLevel,
    };
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
