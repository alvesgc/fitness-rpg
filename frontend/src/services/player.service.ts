import { api } from "./api";
import type { Player } from "../domain/player/player.types";

export async function getCurrentPlayer(): Promise<Player> {
  const response = await api.get<Player>("/players/me");
  return response.data;
}

export interface AddXpPayload {
  amount: number;
  type: string;
  description: string;
}

export async function addPlayerXp(id: string, payload: AddXpPayload) {
  const response = await api.post(`/players/${id}/xp`, payload);
  return response.data;
}
