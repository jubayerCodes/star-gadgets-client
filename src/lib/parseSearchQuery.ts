import { PAGINATION } from "@/constants";
import { ReadonlyURLSearchParams } from "next/navigation";

export interface SearchQuery {
  page: number;
  limit: number;
  search?: string;
  featured?: string;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
}

export const parseSearchQuery = (query: ReadonlyURLSearchParams): SearchQuery => {
  const page = Number(query.get("page")) || PAGINATION.DEFAULT_PAGE;
  const limit = Number(query.get("limit")) || PAGINATION.DEFAULT_LIMIT;
  const search = query.get("search") ?? undefined;
  const featured = query.get("featured") ?? undefined;
  const sortBy = query.get("sortBy") ?? undefined;
  const sortOrder = query.get("sortOrder") ?? undefined;
  const category = query.get("category") ?? undefined;

  return {
    page,
    limit,
    search,
    featured,
    sortBy,
    sortOrder,
    category,
  };
};
