import type { XpStatus } from "../../domain/xp/xp.types";

interface XpBarProps {
  xp: XpStatus;
}

export function XpBar({ xp }: XpBarProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">
            Nível
          </p>

          <p className="text-3xl font-bold">
            {xp.level}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-400">
            XP Total
          </p>

          <p className="font-semibold">
            {xp.totalXp} XP
          </p>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-400">
          Progresso
        </span>

        <span className="font-medium">
          {xp.xpInLevel} / {xp.xpNeeded} XP
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{
            width: `${xp.progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        {xp.xpNeeded - xp.xpInLevel} XP para o próximo nível
      </p>
    </div>
  );
}