import { axiosInstance } from "@/lib/axios";
import { LoginFormValues, RegisterFormValues } from "../schema";
import { ApiResponse } from "@/types";
import { IUser } from "../types";

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
