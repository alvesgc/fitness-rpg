import { PlayerCard } from "../../components/player/PlayerCard";

export function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Fitness RPG</h1>

        <PlayerCard
          name="Alisson"
          level={18}
          xp={8200}
          xpRequired={10000}
          rank="GOLD II"
        />
      </div>
    </main>
  );
}
