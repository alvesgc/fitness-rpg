import { PlayerCard } from "../../components/player/PlayerCard";
import { usePlayer } from "../../hooks/usePlayer";

export function Dashboard() {
  const { data: player, isLoading, isError } = usePlayer();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Carregando jogador...</p>
        </div>
      </main>
    );
  }

  if (isError || !player) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-red-400">Não foi possível carregar o jogador.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Fitness RPG</h1>

        <PlayerCard
          name={player.name}
          level={player.progression.level}
          xp={player.progression.currentXp}
          xpRequired={player.progression.xpToNextLevel}
          rank={player.rank.name}
        />
      </div>
    </main>
  );
}
