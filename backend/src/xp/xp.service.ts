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

  getRequiredXpForNextLevel(level: number): number {
    return 500 * level;
  }

  getLevelFromXp(totalXp: number): number {
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
    /*
     * Verifica se este evento já concedeu XP.
     */
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
        const profile = await this.getProfile(userId);

        const level = this.getLevelFromXp(profile.totalXp);

        return {
          transaction: existingTransaction,
          profile,
          xpGained: 0,
          oldLevel: level,
          newLevel: level,
          leveledUp: false,
          alreadyAwarded: true,
        };
      }
    }

    const profile = await this.getProfile(userId);

    const oldLevel = this.getLevelFromXp(profile.totalXp);

    /*
     * Registra a transação de XP.
     */
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

    /*
     * Atualiza o XP total do jogador.
     */
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
      transaction,
      profile: updatedProfile,
      xpGained: amount,
      oldLevel,
      newLevel,
      leveledUp: newLevel > oldLevel,
      alreadyAwarded: false,
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

    const progress =
      xpNeeded > 0 ? Math.floor((xpInLevel / xpNeeded) * 100) : 0;

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
