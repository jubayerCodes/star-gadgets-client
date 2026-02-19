import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ISubCategory, ISubCategoryAdmin } from "../types";

export const getSubCategoriesAdminApi = async (): Promise<ApiResponse<ISubCategoryAdmin[]>> => {
  const res = await axiosInstance.get("/sub-categories/admin");
  return res.data;
};

export const createSubCategoryApi = async (data: FormData): Promise<ApiResponse<ISubCategory>> => {
  const res = await axiosInstance.post("/sub-categories", data);
  return res.data;
};
