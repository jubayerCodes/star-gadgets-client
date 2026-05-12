"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import FilterSelect from "@/components/filter-select";
import { IconX } from "@tabler/icons-react";
import SearchInput from "@/components/search-input";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { ORDER_STATUS_OPTIONS } from "@/features/checkout/components/modals/update-order-status-modal";
import { PaymentMethod } from "@/features/checkout/types";

export const PAYMENT_STATUS_OPTIONS = [
  { value: "UNPAID", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = ["cod", "online"];

const OrdersFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state for text/number inputs
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minTotal, setMinTotal] = useState(searchParams.get("minTotal") ?? "");
  const [maxTotal, setMaxTotal] = useState(searchParams.get("maxTotal") ?? "");

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minTotal, 500);
  const debouncedMaxPrice = useDebounce(maxTotal, 500);

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
    setParam("minTotal", debouncedMinPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMinPrice]);

  useEffect(() => {
    setParam("maxTotal", debouncedMaxPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMaxPrice]);

  const hasFilters =
    !!searchParams.get("search") ||
    !!searchParams.get("status") ||
    !!searchParams.get("paymentMethod") ||
    !!searchParams.get("paymentStatus") ||
    !!searchParams.get("minTotal") ||
    !!searchParams.get("maxTotal");

  const clearFilters = () => {
    setSearch("");
    setMinTotal("");
    setMaxTotal("");
    router.push(pathname);
  };

  return (
    <div className="flex justify-between mb-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email, order code…"
        className="flex-1 max-w-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          value={searchParams.get("paymentMethod") ?? "all"}
          onChange={(v) => setParam("paymentMethod", v)}
          options={PAYMENT_METHOD_OPTIONS.map((method) => ({ label: method.toUpperCase(), value: method }))}
          allLabel="All Methods"
          className="w-full md:w-36"
        />

        <FilterSelect
          value={searchParams.get("paymentStatus") ?? "all"}
          onChange={(v) => setParam("paymentStatus", v)}
          options={PAYMENT_STATUS_OPTIONS}
          allLabel="All Payments"
          className="w-full md:w-36"
        />

        <FilterSelect
          value={searchParams.get("status") ?? "all"}
          onChange={(v) => setParam("status", v)}
          options={ORDER_STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
          allLabel="All Status"
          className="w-full md:w-32"
        />

        {/* Price range */}
        <div className="flex items-center gap-1">
          <Input
            placeholder="Min ৳"
            type="number"
            value={minTotal}
            onChange={(e) => setMinTotal(e.target.value)}
            className="h-9 text-sm w-24 focus:ring-0 focus-visible:ring-0"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <Input
            placeholder="Max ৳"
            type="number"
            value={maxTotal}
            onChange={(e) => setMaxTotal(e.target.value)}
            className="h-9 text-sm w-24 focus:ring-0 focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <DashboardButton variant="ghost" onClick={clearFilters} className="gap-1 text-muted-foreground h-9">
              <IconX size={14} />
              Clear filters
            </DashboardButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersFilter;
