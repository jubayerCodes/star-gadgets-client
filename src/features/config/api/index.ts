import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IHeaderConfigResponse } from "../types";

export const getHeaderConfig = async (): Promise<ApiResponse<IHeaderConfigResponse>> => {
  const res = await axiosInstance.get("/config/header");
  return res.data;
};
