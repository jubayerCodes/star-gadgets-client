import { QUERY_KEYS } from "@/constants";
import { createSubCategoryApi, getSubCategoriesAdminApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const subCategoriesAdminQueryOptions = () => {
  return {
    queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN],
    queryFn: getSubCategoriesAdminApi,
  };
};

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES] });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
