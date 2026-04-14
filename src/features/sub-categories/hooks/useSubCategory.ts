import { QUERY_KEYS } from "@/constants";
import { createSubCategoryApi, getSubCategoriesAdminApi, updateSubCategoryApi, getSubCategoriesListApi } from "../api";
import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";

export const subCategoriesAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN, searchParams.toString()],
    queryFn: () => getSubCategoriesAdminApi(searchParams),
  };
};

export const useSubCategoriesListInfinityQuery = (search: string, categoryId?: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SUB_CATEGORIES_LIST, search, categoryId],
    queryFn: ({ pageParam }) => getSubCategoriesListApi({ page: pageParam, limit: 20, search, categoryId }),
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

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUB_CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES_LIST] });
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
