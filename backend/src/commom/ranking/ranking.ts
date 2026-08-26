export interface PlayerRank {
  name: string;
  rating: number;
}

export function calculateRank(totalXp: number): PlayerRank {
  if (totalXp >= 50000) {
    return {
      name: 'DIAMOND',
      rating: 2000,
    };
  }

  if (totalXp >= 30000) {
    return {
      name: 'PLATINUM',
      rating: 1800,
    };
  }

  if (totalXp >= 15000) {
    return {
      name: 'GOLD',
      rating: 1500,
    };
  }

  if (totalXp >= 5000) {
    return {
      name: 'SILVER',
      rating: 1200,
    };
  }

  return {
    name: 'BRONZE',
    rating: 1000,
  };
}
