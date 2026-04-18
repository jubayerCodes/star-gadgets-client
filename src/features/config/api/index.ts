import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IConfigResponse } from "../types";
import { UpdateHeaderConfigPayload } from "../header/schema";
import { UpdateHeroConfigPayload } from "../hero/types";

export const getConfigApi = async (): Promise<ApiResponse<IConfigResponse>> => {
  const res = await axiosInstance.get("/config");
  return res.data;
};

export const updateConfigApi = async (
  id: string,
  data: UpdateHeaderConfigPayload,
): Promise<ApiResponse<IConfigResponse>> => {
  const res = await axiosInstance.patch(`/config/header/${id}`, data);
  return res.data;
};

export const updateHeroConfigApi = async (
  id: string,
  data: UpdateHeroConfigPayload,
): Promise<ApiResponse<IConfigResponse>> => {
  const res = await axiosInstance.patch(`/config/hero/${id}`, data);
  return res.data;
};

export const updateShippingConfigApi = async (
  id: string,
  data: { shippingMethods: { name: string; cost: number }[] },
): Promise<ApiResponse<IConfigResponse>> => {
  const res = await axiosInstance.patch(`/config/shipping/${id}`, data);
  return res.data;
};

