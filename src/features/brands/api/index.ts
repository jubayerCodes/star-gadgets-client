import { IBrand } from "@/features/brands/types";
import { axiosInstance } from "@/lib/axios";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ApiResponse } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getBrandsAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IBrand[]>> => {
  const { page, limit } = parseSearchQuery(query);
  const res = await axiosInstance.get("/brands/admin", {
    params: { page, limit },
  });
  return res.data;
};

export const createBrandApi = async (data: FormData): Promise<ApiResponse<IBrand>> => {
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
  data: FormData;
}): Promise<ApiResponse<IBrand>> => {
  const res = await axiosInstance.patch(`/brands/${id}`, data);
  return res.data;
};
