interface PlayerCardProps {
  name: string;
  level: number;
  xp: number;
  xpRequired: number;
  rank: string;
}

export function PlayerCard({
  name,
  level,
  xp,
  xpRequired,
  rank,
}: PlayerCardProps) {
  const progress = (xp / xpRequired) * 100;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-400">PLAYER</p>

          <h2 className="text-2xl font-bold">{name}</h2>
        </div>

        <span className="rounded-lg bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
          {rank}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Level {level}</span>

          <span>
            {xp} / {xpRequired} XP
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-yellow-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
