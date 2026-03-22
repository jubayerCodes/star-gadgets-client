import { IBrand } from "@/features/brands/types";
import { axiosInstance } from "@/lib/axios";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ApiResponse } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { CreateBrandFormData, UpdateBrandFormData } from "../schema";

export const getBrandsAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IBrand[]>> => {
  const { page, limit, search, featured, sortBy, sortOrder } = parseSearchQuery(query);
  const res = await axiosInstance.get("/brands/admin", {
    params: { page, limit, search, featured, sortBy, sortOrder },
  });
  return res.data;
};

export const getBrandsListApi = async (query: {
  page: number;
  limit: number;
  search?: string;
}): Promise<ApiResponse<IBrand[]>> => {
  const { page, limit, search } = query;
  const res = await axiosInstance.get("/brands/list", {
    params: { page, limit, search },
  });
  return res.data;
};

export const createBrandApi = async (data: CreateBrandFormData): Promise<ApiResponse<IBrand>> => {
  const res = await axiosInstance.post("/brands", data);
  return res.data;
};

export const deleteBrandApi = async (id: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete(`/brands/${id}`);
  return res.data;
};

export const updateBrandApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateBrandFormData;
}): Promise<ApiResponse<IBrand>> => {
  const res = await axiosInstance.patch(`/brands/${id}`, data);
  return res.data;
};
