import { axiosInstance } from "@/lib/axios";
import { CreateProductFormData, UpdateProductFormData } from "../schemas/product.schema";
import { ApiResponse } from "@/types";
import { IProduct, IProductAdmin } from "../types/product.types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getProductsAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IProductAdmin[]>> => {
  const { page, limit } = parseSearchQuery(query);

  const params: Record<string, string | number | undefined> = { page, limit };

  const search = query.get("search");
  const isActive = query.get("isActive");
  const category = query.get("category");
  const subCategory = query.get("subCategory");
  const brand = query.get("brand");
  const minPrice = query.get("minPrice");
  const maxPrice = query.get("maxPrice");
  const sortBy = query.get("sortBy");
  const sortOrder = query.get("sortOrder");

  if (search) params.search = search;
  if (isActive !== null) params.isActive = isActive;
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

export const updateProductApi = async ({ id, data }: { id: string; data: UpdateProductFormData }): Promise<ApiResponse<IProduct>> => {
  const res = await axiosInstance.patch(`/products/${id}`, data);
  return res.data;
};
