import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICategory, ICategoryWithSubCategories } from "../types";

export const getCategoriesAdminApi = async (): Promise<ApiResponse<ICategoryWithSubCategories[]>> => {
  const res = await axiosInstance.get("/categories/admin");
  return res.data;
};

export const createCategoryApi = async (data: FormData): Promise<ApiResponse<ICategory>> => {
  const res = await axiosInstance.post("/categories", data);
  return res.data;
};
