import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICategoryWithSubCategories } from "../types";

export const getCategoriesPopulatedApi = async (): Promise<ApiResponse<ICategoryWithSubCategories[]>> => {
  const res = await axiosInstance.get("/categories/populated");
  return res.data;
};
