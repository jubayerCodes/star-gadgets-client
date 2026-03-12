import { axiosInstance } from "@/lib/axios";
import { CreateProductFormData } from "../schemas/product.schema";
import { ApiResponse } from "@/types";
import { IProduct } from "../types/product.types";

export const createProductApi = async (data: CreateProductFormData): Promise<ApiResponse<IProduct>> => {
  const response = await axiosInstance.post("/products", data);
  return response.data;
};
