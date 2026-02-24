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

export type QueryType<T = Record<string, unknown>> = {
  page?: number;
  limit?: number;
  search?: string;
  filterBy?: string;
  sortBy?: string;
  sortOrder?: string;
} & T;
