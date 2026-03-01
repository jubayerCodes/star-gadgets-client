import { axiosInstance } from "@/lib/axios";
import { ApiResponse, QueryType } from "@/types";
import { ICategory, ICategoryAdmin } from "../types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getCategoriesAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<ICategoryAdmin[]>> => {
  const { page, limit } = parseSearchQuery(query);
  const res = await axiosInstance.get("/categories/admin", {
    params: { page, limit },
  });
  return res.data;
};

export const createCategoryApi = async (data: FormData): Promise<ApiResponse<ICategory>> => {
  const res = await axiosInstance.post("/categories", data);
  return res.data;
};

export const updateCategoryApi = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}): Promise<ApiResponse<ICategory>> => {
  const res = await axiosInstance.patch(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategoryApi = async (id: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};

export const getCategoriesListApi = async (
  query: QueryType,
): Promise<ApiResponse<Pick<ICategory, "_id" | "title" | "slug">[]>> => {
  const { page, limit, search } = query;
  const res = await axiosInstance.get("/categories/list", {
    params: { page, limit, search },
  });
  return res.data;
};
