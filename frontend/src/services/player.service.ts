import { apiFetch } from "./api";
import type { Player } from "../domain/player/player.types";

export async function getPlayer(id: string): Promise<Player> {
  return apiFetch<Player>(`/players/${id}`);
}
