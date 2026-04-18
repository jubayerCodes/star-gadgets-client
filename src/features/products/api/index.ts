import { axiosInstance } from "@/lib/axios";
import { CreateProductFormData, UpdateProductFormData } from "../schemas/product.schema";
import { ApiResponse } from "@/types";
import {
  CategoryProductsParams,
  ICategoryProductsData,
  IFeaturedProduct,
  IProduct,
  IProductAdmin,
  IPublicProductsData,
  ISearchResultData,
  PublicProductsParams,
  ISearchFiltersData,
  IListingFiltersData,
  ICategoryFiltersData,
  SubCategoryProductsParams,
  ISubCategoryProductsData,
  ISubCategoryFiltersData,
} from "../types/product.types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getProductsAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IProductAdmin[]>> => {
  const { page, limit } = parseSearchQuery(query);

  const params: Record<string, string | number | undefined> = { page, limit };

  const search = query.get("search");
  const isActive = query.get("isActive");
  const isFeatured = query.get("isFeatured");
  const category = query.get("category");
  const subCategory = query.get("subCategory");
  const brand = query.get("brand");
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const sortBy = query.get("sortBy");
  const sortOrder = query.get("sortOrder");

  if (search) params.search = search;
  if (isActive !== null) params.isActive = isActive;
  if (isFeatured !== null) params.isFeatured = isFeatured;
  if (category) params.category = category;
  if (subCategory) params.subCategory = subCategory;
  if (brand) params.brand = brand;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  const res = await axiosInstance.get("/products/admin", { params });
  return res.data;
};

export const createProductApi = async (data: CreateProductFormData): Promise<ApiResponse<IProduct>> => {
  const response = await axiosInstance.post("/products", data);
  return response.data;
};

export const deleteProductApi = async (id: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

export const getProductByIdApi = async (id: string): Promise<ApiResponse<IProduct>> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};

export const updateProductApi = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<UpdateProductFormData>;
}): Promise<ApiResponse<IProduct>> => {
  const res = await axiosInstance.patch(`/products/${id}`, data);
  return res.data;
};

export const getFeaturedProductsApi = async (): Promise<ApiResponse<IFeaturedProduct[]>> => {
  const res = await axiosInstance.get("/products/featured");
  return res.data;
};

export const getProductBySlugApi = async (slug: string): Promise<ApiResponse<IProduct>> => {
  const res = await axiosInstance.get(`/products/slug/${slug}`);
  return res.data;
};

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  availability?: "inStock" | "outOfStock";
  brand?: string;
  subCategory?: string;
  sortBy?: "relevance" | "priceAsc" | "priceDesc" | "newest";
}

export const searchProductsApi = async (params: SearchParams): Promise<ApiResponse<ISearchResultData>> => {
  const { query, page = 1, limit = 20, minPrice, maxPrice, availability, brand, subCategory, sortBy } = params;
  const queryParams: Record<string, string | number | undefined> = { query, page, limit };
  if (minPrice !== undefined) queryParams.minPrice = minPrice;
  if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
  if (availability) queryParams.availability = availability;
  if (brand) queryParams.brand = brand;
  if (subCategory) queryParams.subCategory = subCategory;
  if (sortBy) queryParams.sortBy = sortBy;
  const res = await axiosInstance.get("/products/search", { params: queryParams });
  return res.data;
};

export const getSearchFiltersApi = async (query: string): Promise<ApiResponse<ISearchFiltersData>> => {
  const res = await axiosInstance.get("/products/search/filters", { params: { query } });
  return res.data;
};

export const getPublicProductsApi = async (
  params: PublicProductsParams,
): Promise<ApiResponse<IPublicProductsData>> => {
  const { page = 1, limit = 20, search, minPrice, maxPrice, availability, brand, category, subCategory, sortBy } =
    params;
  const queryParams: Record<string, string | number | undefined> = { page, limit };
  if (search) queryParams.search = search;
  if (minPrice !== undefined) queryParams.minPrice = minPrice;
  if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
  if (availability) queryParams.availability = availability;
  if (brand) queryParams.brand = brand;
  if (category) queryParams.category = category;
  if (subCategory) queryParams.subCategory = subCategory;
  if (sortBy) queryParams.sortBy = sortBy;
  const res = await axiosInstance.get("/products/listing", { params: queryParams });
  return res.data;
};

export const getListingFiltersApi = async (): Promise<ApiResponse<IListingFiltersData>> => {
  const res = await axiosInstance.get("/products/listing/filters");
  return res.data;
};

export const getCategoryProductsApi = async (
  params: CategoryProductsParams,
): Promise<ApiResponse<ICategoryProductsData>> => {
  const { categorySlug, page = 1, limit = 20, search, minPrice, maxPrice, availability, brand, subCategory, sortBy } =
    params;
  const queryParams: Record<string, string | number | undefined> = { page, limit };
  if (search) queryParams.search = search;
  if (minPrice !== undefined) queryParams.minPrice = minPrice;
  if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
  if (availability) queryParams.availability = availability;
  if (brand) queryParams.brand = brand;
  if (subCategory) queryParams.subCategory = subCategory;
  if (sortBy) queryParams.sortBy = sortBy;
  const res = await axiosInstance.get(`/products/category/${categorySlug}`, { params: queryParams });
  return res.data;
};

export const getCategoryFiltersApi = async (categorySlug: string): Promise<ApiResponse<ICategoryFiltersData>> => {
  const res = await axiosInstance.get(`/products/category/${categorySlug}/filters`);
  return res.data;
};

export const getSubCategoryProductsApi = async (
  params: SubCategoryProductsParams,
): Promise<ApiResponse<ISubCategoryProductsData>> => {
  const { subCategorySlug, page = 1, limit = 20, search, minPrice, maxPrice, availability, brand, sortBy } = params;
  const queryParams: Record<string, string | number | undefined> = { page, limit };
  if (search) queryParams.search = search;
  if (minPrice !== undefined) queryParams.minPrice = minPrice;
  if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;
  if (availability) queryParams.availability = availability;
  if (brand) queryParams.brand = brand;
  if (sortBy) queryParams.sortBy = sortBy;
  const res = await axiosInstance.get(`/products/sub-category/${subCategorySlug}`, { params: queryParams });
  return res.data;
};

export const getSubCategoryFiltersApi = async (subCategorySlug: string): Promise<ApiResponse<ISubCategoryFiltersData>> => {
  const res = await axiosInstance.get(`/sub-categories/${subCategorySlug}/filters`);
  return res.data;
};
