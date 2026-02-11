import { QUERY_KEYS } from "@/constants";
import { getCategoriesAdminApi } from "../api";

export const categoriesAdminQueryOptions = () => {
  return {
    queryKey: [QUERY_KEYS.CATEGORIES_ADMIN],
    queryFn: getCategoriesAdminApi,
  };
};
