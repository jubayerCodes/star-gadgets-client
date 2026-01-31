import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IConfigResponse } from "../types";

export const getConfigApi = async (): Promise<ApiResponse<IConfigResponse>> => {
  const res = await axiosInstance.get("/config");
  return res.data;
};
