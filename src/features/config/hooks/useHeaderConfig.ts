import { ApiResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getHeaderConfig } from "../api";
import { IHeaderConfigResponse } from "../types";
import { QUERY_KEYS } from "@/constants";

export const useGetHeaderConfig = () => {
  return useQuery<ApiResponse<IHeaderConfigResponse>>({
    queryKey: [QUERY_KEYS.CONFIG.HEADER],
    queryFn: getHeaderConfig,
  });
};
