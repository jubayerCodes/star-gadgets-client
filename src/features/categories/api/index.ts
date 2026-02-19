import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICategory } from "../types";

export const getCategoriesAdminApi = async (): Promise<ApiResponse<ICategory[]>> => {
  const res = await axiosInstance.get("/categories/admin");
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

export const getCategoriesListApi = async ({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<ApiResponse<Pick<ICategory, "_id" | "title" | "slug">[]>> => {
  const res = await axiosInstance.get("/categories/list", { params: { page: pageParam } });
  return res.data;
};
