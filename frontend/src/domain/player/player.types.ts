export interface PlayerProgression {
  level: number;
  totalXp: number;
  currentXp: number;
  xpToNextLevel: number;
  progress: number;
}

export interface PlayerRank {
  name: string;
  rating: number;
}

export interface Player {
  id: string;
  name: string;
  progression: PlayerProgression;
  rank: PlayerRank;
  streak: number;
}
