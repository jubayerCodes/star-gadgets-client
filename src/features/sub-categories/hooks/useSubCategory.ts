import { QUERY_KEYS } from "@/constants";
import { createSubCategoryApi, getSubCategoriesAdminApi, updateSubCategoryApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";

export const subCategoriesAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN, searchParams.toString()],
    queryFn: () => getSubCategoriesAdminApi(searchParams),
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

export const useUpdateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubCategoryApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
