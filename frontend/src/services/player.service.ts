import { apiFetch } from "./api";
import type { Player } from "../domain/player/player.types";

export async function getPlayer(id: string): Promise<Player> {
  return apiFetch<Player>(`/players/${id}`);
}

export interface AddXpPayload {
  amount: number;
  type: string;
  description: string;
}

export async function addPlayerXp(id: string, payload: AddXpPayload) {
  return apiFetch(`/players/${id}/xp`, {
    method: "POST",

    body: JSON.stringify(payload),
  });
}
