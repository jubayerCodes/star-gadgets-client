import { QUERY_KEYS } from "@/constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProductApi,
  deleteProductApi,
  getFeaturedProductsApi,
  getProductByIdApi,
  getProductBySlugApi,
  getProductsAdminApi,
  getPublicProductsApi,
  searchProductsApi,
  SearchParams,
  updateProductApi,
} from "../api";
import { extractErrorMessage } from "@/lib/extract-error-message";
import { ReadonlyURLSearchParams } from "next/navigation";
import { PublicProductsParams } from "../types/product.types";

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

export const useGetFeaturedProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCTS],
    queryFn: getFeaturedProductsApi,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetProductBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "slug", slug],
    queryFn: () => getProductBySlugApi(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSearchProductsQuery = (params: SearchParams) => {
  const { query, page = 1, limit = 20, minPrice, maxPrice, availability, brand, sortBy } = params;
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_SEARCH, query, page, limit, minPrice, maxPrice, availability, brand, sortBy],
    queryFn: () => searchProductsApi(params),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useGetPublicProductsQuery = (params: PublicProductsParams) => {
  const { page, limit, search, minPrice, maxPrice, availability, brand, category, subCategory, sortBy } = params;
  return useQuery({
    queryKey: [
      QUERY_KEYS.PRODUCTS_LISTING,
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      availability,
      brand,
      category,
      subCategory,
      sortBy,
    ],
    queryFn: () => getPublicProductsApi(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
};
