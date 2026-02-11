import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICategoryWithSubCategories } from "../types";

export const getCategoriesAdminApi = async (): Promise<ApiResponse<ICategoryWithSubCategories[]>> => {
  const res = await axiosInstance.get("/categories/admin");
  return res.data;
};
