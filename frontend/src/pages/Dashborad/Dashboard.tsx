import { PlayerCard } from "../../components/player/PlayerCard";
import { usePlayer } from "../../hooks/usePlayer";
import { useXp } from "../../hooks/useXp";
import { useAuth } from "../../context/AuthContext";

export function Dashboard() {
  const { data: player, isLoading, isError } = usePlayer();

  const { data: xp, isLoading: isXpLoading, isError: isXpError } = useXp();

  const { logout } = useAuth();

  if (isLoading || isXpLoading) {
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

  if (isXpError || !xp) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-red-400">
            Não foi possível carregar os dados de XP.
          </p>
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
          level={xp.level}
          xp={xp.xpInLevel}
          xpRequired={xp.xpNeeded}
          rank={player.rank.name}
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={logout}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
          >
            Sair
          </button>
        </div>
      </div>
    </main>
  );
}
