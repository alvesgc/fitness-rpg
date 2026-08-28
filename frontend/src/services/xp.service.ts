import { api } from "./api";
import type { XpStatus } from "../domain/xp/xp.types";

export async function getXpStatus(): Promise<XpStatus> {
  const response = await api.get<XpStatus>("/xp/status");

  return response.data;
}
