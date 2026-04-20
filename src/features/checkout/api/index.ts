import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";
import { ICreateOrderPayload, IOrder, IValidateCouponPayload, IValidateCouponResponse } from "../types";

export const validateCouponApi = async (
  data: IValidateCouponPayload
): Promise<ApiResponse<IValidateCouponResponse>> => {
  const res = await axiosInstance.post("/coupons/validate", data);
  return res.data;
};

export const createOrderApi = async (
  data: ICreateOrderPayload
): Promise<ApiResponse<IOrder>> => {
  const res = await axiosInstance.post("/orders", data);
  return res.data;
};

export const getOrderByIdApi = async (id: string): Promise<ApiResponse<IOrder>> => {
  const res = await axiosInstance.get(`/orders/${id}`);
  return res.data;
};

export const getMyOrdersApi = async (page = 1): Promise<ApiResponse<IOrder[]>> => {
  const res = await axiosInstance.get("/orders/my", { params: { page } });
  return res.data;
};

export const updateOrderStatusApi = async ({
  id,
  orderStatus,
}: {
  id: string;
  orderStatus: string;
}): Promise<ApiResponse<IOrder>> => {
  const res = await axiosInstance.patch(`/orders/${id}/status`, { orderStatus });
  return res.data;
};

export const getAllOrdersApi = async (query: Record<string, string>): Promise<ApiResponse<IOrder[]>> => {
  const res = await axiosInstance.get("/orders", { params: query });
  return res.data;
};
