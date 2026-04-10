import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IBadge } from "../types";
import { CreateBadgeFormData, UpdateBadgeFormData } from "../schema";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getBadgesAdminApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IBadge[]>> => {
  const { page, limit, search, sortBy, sortOrder } = parseSearchQuery(query);
  const res = await axiosInstance.get("/badges", {
    params: { page, limit, search, sortBy, sortOrder },
  });
  return res.data;
};

export const createBadgeApi = async (data: CreateBadgeFormData): Promise<ApiResponse<IBadge>> => {
  const res = await axiosInstance.post("/badges", data);
  return res.data;
};

export const updateBadgeApi = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateBadgeFormData;
}): Promise<ApiResponse<IBadge>> => {
  const res = await axiosInstance.patch(`/badges/${id}`, data);
  return res.data;
};

export const deleteBadgeApi = async (id: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete(`/badges/${id}`);
  return res.data;
};
