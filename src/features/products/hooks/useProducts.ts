import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProductApi, deleteProductApi, getProductByIdApi, getProductsAdminApi, updateProductApi } from "../api";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";

export const productsAdminQueryOptions = (searchParams: ReadonlyURLSearchParams) => {
  return {
    queryKey: [QUERY_KEYS.PRODUCTS_ADMIN, searchParams.toString()],
    queryFn: () => getProductsAdminApi(searchParams),
    placeholderData: keepPreviousData,
    keepPreviousData: true,
  };
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success(data.message || "Product created successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success(data.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useGetProductByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, id],
    queryFn: () => getProductByIdApi(id),
    enabled: !!id,
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS_ADMIN] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success(data.message || "Product updated successfully");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
