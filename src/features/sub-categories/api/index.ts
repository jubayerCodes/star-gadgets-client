import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ISubCategory, ISubCategoryAdmin } from "../types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";
import { CreateSubCategoryFormData, UpdateSubCategoryFormData } from "../schema";

export const getSubCategoriesAdminApi = async (
  query: ReadonlyURLSearchParams,
): Promise<ApiResponse<ISubCategoryAdmin[]>> => {
  const { limit, page } = parseSearchQuery(query);

  const res = await axiosInstance.get("/sub-categories/admin", {
    params: {
      limit,
      page,
    },
  });
  return res.data;
};

export const getSubCategoriesListApi = async (query: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}): Promise<ApiResponse<ISubCategoryAdmin[]>> => {
  const { page, limit, search, categoryId } = query;
  const res = await axiosInstance.get("/sub-categories/list", {
    params: { page, limit, search, categoryId },
  });
  return res.data;
};

export const createSubCategoryApi = async (data: CreateSubCategoryFormData): Promise<ApiResponse<ISubCategory>> => {
  const res = await axiosInstance.post("/sub-categories", data);
  return res.data;
};

export const updateSubCategoryApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateSubCategoryFormData;
}): Promise<ApiResponse<ISubCategory>> => {
  const res = await axiosInstance.patch(`/sub-categories/${id}`, data);
  return res.data;
};
