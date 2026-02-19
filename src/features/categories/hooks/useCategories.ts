import { QUERY_KEYS } from "@/constants";
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesAdminApi,
  getCategoriesListApi,
  updateCategoryApi,
} from "../api";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const categoriesAdminQueryOptions = () => {
  return {
    queryKey: [QUERY_KEYS.CATEGORIES_ADMIN],
    queryFn: getCategoriesAdminApi,
  };
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
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

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategoryApi,
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

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
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

export const useCategoriesListInfinityQuery = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.CATEGORIES_LIST],
    queryFn: getCategoriesListApi,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage.meta;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.meta;
      return page > 1 ? page - 1 : undefined;
    },
  });
};
