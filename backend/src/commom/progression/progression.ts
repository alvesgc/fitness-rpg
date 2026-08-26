export interface Progression {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progress: number;
}

export function calculateProgression(totalXp: number): Progression {
  let level = 1;
  let remainingXp = totalXp;
  let xpRequired = 1000;

  while (remainingXp >= xpRequired) {
    remainingXp -= xpRequired;
    level++;

    xpRequired = level * 1000;
  }

  const progress = (remainingXp / xpRequired) * 100;

  return {
    level,
    currentXp: remainingXp,
    xpToNextLevel: xpRequired,
    progress: Number(progress.toFixed(1)),
  };
}
