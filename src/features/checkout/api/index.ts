import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { IValidateCouponPayload, IValidateCouponResponse } from "../types";

export const validateCouponApi = async (
  data: IValidateCouponPayload
): Promise<ApiResponse<IValidateCouponResponse>> => {
  const res = await axiosInstance.post("/coupons/validate", data);
  return res.data;
};
