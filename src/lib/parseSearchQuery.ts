import { PAGINATION } from "@/constants";
import { ReadonlyURLSearchParams } from "next/navigation";

export interface SearchQuery {
  page: number;
  limit: number;
}

export const parseSearchQuery = (query: ReadonlyURLSearchParams) => {
  const page = Number(query.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(query.get("limit")) || PAGINATION.DEFAULT_LIMIT;

  return {
    page,
    limit,
  };
};
