import { HttpStatusCode } from "axios";

export interface Meta {
  page: number;
  total: number;
  limit: number;
  skip: number;
}

export interface ApiResponse<T> {
  statusCode: HttpStatusCode;
  success: boolean;
  message: string;
  meta: Meta;
  data: T;
}
