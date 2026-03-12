import { QUERY_KEYS } from "@/constants";
import { ReadonlyURLSearchParams } from "next/navigation";
import { createBrandApi, deleteBrandApi, getBrandsAdminApi, updateBrandApi, getBrandsListApi } from "../api";
import { keepPreviousData, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/extract-error-message";

export const brandsAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.BRANDS_ADMIN, searchParams.toString()],
    queryFn: () => getBrandsAdminApi(searchParams),
    placeholderData: keepPreviousData,
    keepPreviousData: true,
  };
};

export const useBrandsListInfinityQuery = (search: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.BRANDS_LIST, search],
    queryFn: ({ pageParam = 1 }) => getBrandsListApi({ page: pageParam as number, limit: 20, search }),
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

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrandApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
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
    mutationFn: updateBrandApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrandApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrandApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
