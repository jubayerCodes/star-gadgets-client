"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { IconX } from "@tabler/icons-react";
import SearchInput from "@/components/search-input";
import DashboardButton from "@/components/dashboard/dashboard-button";

const BadgesFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 400);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    setParam("search", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasFilters = !!searchParams.get("search");

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by title…"
        className="flex-1 max-w-sm"
      />

      {hasFilters && (
        <DashboardButton variant="ghost" onClick={clearFilters} className="gap-1 text-muted-foreground h-9">
          <IconX size={14} />
          Clear
        </DashboardButton>
      )}
    </div>
  );
};

export default BadgesFilter;
