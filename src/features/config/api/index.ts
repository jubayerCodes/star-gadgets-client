import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IConfigResponse } from "../types";
import { UpdateHeaderConfigPayload } from "../header/schema";

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
