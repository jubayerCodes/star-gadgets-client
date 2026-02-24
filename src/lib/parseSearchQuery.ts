import { QueryType } from "@/types";

export const parseSearchQuery = <T>(query: QueryType<T>): QueryType<T> => {
  const page = Number(query.page);
  const limit = Number(query.limit);
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder;
  const search = query.search;

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  } as QueryType<T>;
};
