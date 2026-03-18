import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProductApi, getProductsAdminApi } from "../api";
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

