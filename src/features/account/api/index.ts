import { axiosInstance } from "@/lib/axios";
import { LoginFormValues, RegisterFormValues, ChangePasswordFormValues } from "../schema";
import { ApiResponse } from "@/types";
import { IUser, IAddress } from "../types";

export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
};

export const createUserApi = async (data: RegisterFormValues): Promise<ApiResponse<IUser>> => {
  const res = await axiosInstance.post("/users", data);
  return res.data;
};

export const loginUserApi = async (data: LoginFormValues): Promise<ApiResponse<IUser>> => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getCurrentUserApi = async (): Promise<ApiResponse<IUser>> => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};

export const logoutUserApi = async (): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const updateProfileApi = async (data: UpdateProfilePayload): Promise<ApiResponse<IUser>> => {
  const res = await axiosInstance.patch("/users/me", data);
  return res.data;
};

export const changePasswordApi = async (data: ChangePasswordFormValues): Promise<ApiResponse<null>> => {
  const res = await axiosInstance.post("/auth/reset-password", data);
  return res.data;
};
