import { QUERY_KEYS } from "@/constants";
import { ApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { IConfigResponse } from "../types";
import { getConfigApi } from "../api";

export const useGetConfig = () => {
  return useQuery<ApiResponse<IConfigResponse>>({
    queryKey: [QUERY_KEYS.CONFIG],
    queryFn: getConfigApi,
  });
};
