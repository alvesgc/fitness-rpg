import { useQuery } from "@tanstack/react-query";

import { getCurrentPlayer } from "../services/player.service";

export function usePlayer() {
  return useQuery({
    queryKey: ["player", "me"],
    queryFn: getCurrentPlayer,
  });
}
