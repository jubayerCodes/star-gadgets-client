import { axiosInstance } from "@/lib/axios";
import { ApiResponse, QueryType } from "@/types";
import { IUploadImage } from "../types";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getImagesApi = async (query: ReadonlyURLSearchParams): Promise<ApiResponse<IUploadImage[]>> => {
  const { page } = parseSearchQuery(query);
  const res = await axiosInstance.get("/uploads", {
    params: { page, limit: 32 },
  });
  return res.data;
};

export const getImagesListApi = async (query: QueryType): Promise<ApiResponse<IUploadImage[]>> => {
  const { page, limit } = query;
  const res = await axiosInstance.get("/uploads", {
    params: { page, limit },
  });
  return res.data;
};

export const uploadImageApi = async (data: FormData): Promise<ApiResponse<IUploadImage>> => {
  const res = await axiosInstance.post("/uploads/single", data);
  return res.data;
};

export const deleteImageApi = async (publicId: string): Promise<ApiResponse<null>> => {
  // It's possible public id contains slashes so we might need to encode it
  const res = await axiosInstance.delete(`/uploads/${encodeURIComponent(publicId)}`);
  return res.data;
};
