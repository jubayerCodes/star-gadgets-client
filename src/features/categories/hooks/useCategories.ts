import { QUERY_KEYS } from "@/constants";
import { createCategoryApi, getCategoriesAdminApi } from "../api";
import { makeQueryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const categoriesAdminQueryOptions = () => {
  return {
    queryKey: [QUERY_KEYS.CATEGORIES_ADMIN],
    queryFn: getCategoriesAdminApi,
  };
};

export const useCreateCategoryMutation = () => {
  const queryClient = makeQueryClient();
  return useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
