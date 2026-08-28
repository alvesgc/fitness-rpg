import { useQuery } from "@tanstack/react-query";

import { getXpStatus } from "../services/xp.service";

export function useXp() {
  return useQuery({
    queryKey: ["xp-status"],
    queryFn: getXpStatus,
  });
}
