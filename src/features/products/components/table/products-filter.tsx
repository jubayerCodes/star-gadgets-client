"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import FilterSelect from "@/components/filter-select";
import { IconX } from "@tabler/icons-react";
import SearchInput from "@/components/search-input";
import InfinityFilterSelect from "@/components/infinity-filter-select";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";
import { useSubCategoriesListInfinityQuery } from "@/features/sub-categories/hooks/useSubCategory";
import { useBrandsListInfinityQuery } from "@/features/brands/hooks/useBrands";
import DashboardButton from "@/components/dashboard/dashboard-button";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "title_asc", label: "Name A–Z" },
  { value: "title_desc", label: "Name Z–A" },
  { value: "priceRange_asc", label: "Price Low–High" },
  { value: "priceRange_desc", label: "Price High–Low" },
  { value: "stock_desc", label: "Stock (Most)" },
  { value: "stock_asc", label: "Stock (Least)" },
];

const STATUS_OPTIONS = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const ProductsFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for text/number inputs
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

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

  // Debounced URL updates for text/price inputs
  useEffect(() => {
    setParam("search", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setParam("minPrice", debouncedMinPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice]);

  useEffect(() => {
    setParam("maxPrice", debouncedMaxPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMaxPrice]);

  const hasFilters =
    !!searchParams.get("search") ||
    !!searchParams.get("category") ||
    !!searchParams.get("subCategory") ||
    !!searchParams.get("brand") ||
    !!searchParams.get("isActive") ||
    !!searchParams.get("minPrice") ||
    !!searchParams.get("maxPrice") ||
    !!searchParams.get("sortBy");

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  };

  // Sort combined value (sortBy_sortOrder)
  const currentSort = searchParams.get("sortBy")
    ? `${searchParams.get("sortBy")}_${searchParams.get("sortOrder") ?? "desc"}`
    : "all";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("sortBy");
      params.delete("sortOrder");
    } else {
      const lastUnder = value.lastIndexOf("_");
      params.set("sortBy", value.slice(0, lastUnder));
      params.set("sortOrder", value.slice(lastUnder + 1));
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
      {/* Row 1: Search + Clear */}
      <div className="flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, slug, code…"
          className="flex-1 w-sm"
        />
        {hasFilters && (
          <DashboardButton variant="ghost" onClick={clearFilters} className="gap-1 text-muted-foreground h-9">
            <IconX size={14} />
            Clear filters
          </DashboardButton>
        )}
      </div>

      {/* Row 2: Infinity selects + static filters */}
      <div className="flex flex-wrap items-center gap-2">
        <InfinityFilterSelect
          placeholder="Category"
          selectedSlug={searchParams.get("category")}
          onSelect={(slug) => setParam("category", slug)}
          infinityFunction={useCategoriesListInfinityQuery}
          className="w-full md:w-40"
        />

        <InfinityFilterSelect
          placeholder="Sub Category"
          selectedSlug={searchParams.get("subCategory")}
          onSelect={(slug) => setParam("subCategory", slug)}
          infinityFunction={useSubCategoriesListInfinityQuery}
          className="w-full md:w-44"
        />

        <InfinityFilterSelect
          placeholder="Brand"
          selectedSlug={searchParams.get("brand")}
          onSelect={(slug) => setParam("brand", slug)}
          infinityFunction={useBrandsListInfinityQuery}
          className="w-full md:w-36"
        />

        {/* Status */}
        <FilterSelect
          value={searchParams.get("isActive") ?? "all"}
          onChange={(v) => setParam("isActive", v)}
          options={STATUS_OPTIONS}
          allLabel="All Status"
          className="w-full md:w-32"
        />

        {/* Price range */}
        <div className="flex items-center gap-1">
          <Input
            placeholder="Min ৳"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9 text-sm w-24"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            placeholder="Max ৳"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9 text-sm w-24"
          />
        </div>

        {/* Sort */}
        <FilterSelect
          value={currentSort}
          onChange={handleSortChange}
          options={SORT_OPTIONS}
          allLabel="Default Sort"
          className="w-full md:w-44"
        />
      </div>
    </div>
  );
};

export default ProductsFilter;
