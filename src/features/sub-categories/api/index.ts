import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ISubCategory, ISubCategoryAdmin } from "../types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

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

export const createSubCategoryApi = async (data: FormData): Promise<ApiResponse<ISubCategory>> => {
  const res = await axiosInstance.post("/sub-categories", data);
  return res.data;
};
