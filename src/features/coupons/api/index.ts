import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICoupon } from "../types";
import { CreateCouponFormData } from "../schema";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getAllCouponsApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<ICoupon[]>> => {
  const res = await axiosInstance.get("/coupons", {
    params: Object.fromEntries(query.entries()),
  });
  return res.data;
};

export const createCouponApi = async (
  data: CreateCouponFormData,
): Promise<ApiResponse<ICoupon>> => {
  const res = await axiosInstance.post("/coupons", {
    ...data,
    expiryDate: new Date(data.expiryDate).toISOString(),
  });
  return res.data;
};

export const deleteCouponApi = async (id: string): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.delete(`/coupons/${id}`);
  return res.data;
};
