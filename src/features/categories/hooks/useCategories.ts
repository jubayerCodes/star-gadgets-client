import { useQuery } from "@tanstack/react-query";
import { getCategoriesPopulatedApi } from "../api";
import { QUERY_KEYS } from "@/constants";
import { ICategoryWithSubCategories } from "../types";
import { ApiResponse } from "@/types";

export const useCategoriesPopulated = () => {
  return useQuery<ApiResponse<ICategoryWithSubCategories[]>>({
    queryKey: [QUERY_KEYS.CATEGORIES_POPULATED],
    queryFn: getCategoriesPopulatedApi,
  });
};
