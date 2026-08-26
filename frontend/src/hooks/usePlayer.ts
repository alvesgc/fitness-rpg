import { useQuery } from "@tanstack/react-query";
import { getPlayer } from "../services/player.service";

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ["player", id],
    queryFn: () => getPlayer(id),
  });
}
