"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import { useSearchProductsQuery } from "@/features/products/hooks/useProducts";
import Image from "next/image";
import { ISearchProduct } from "@/features/products/types/product.types";

function formatPrice(priceRange: number | { min: number; max: number }): string {
  if (typeof priceRange === "number") {
    return `৳${priceRange.toLocaleString("en-BD")}`;
  }
  if (priceRange.min === priceRange.max) {
    return `৳${priceRange.min.toLocaleString("en-BD")}`;
  }
  return `৳${priceRange.min.toLocaleString("en-BD")} – ৳${priceRange.max.toLocaleString("en-BD")}`;
}

const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSearchPage = pathname === "/search";

  // Initialise from URL when on the search page
  const urlQuery = searchParams.get("query") ?? "";
  const [query, setQuery] = useState(isSearchPage ? urlQuery : "");
  const [debouncedQuery, setDebouncedQuery] = useState(isSearchPage ? urlQuery : "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep input in sync when the URL query param changes externally
  // (browser back/forward, or search-results-content updating the URL)
  useEffect(() => {
    if (isSearchPage) {
      setQuery(urlQuery);
    }
  }, [urlQuery, isSearchPage]);

  // Debounce — on search page push directly to URL instead of local dropdown search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isSearchPage) {
        // On search page: update the URL query param in-place (keeps filters)
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim().length >= 2) {
          params.set("query", query.trim());
          params.set("page", "1");
        } else if (query.trim() === "") {
          params.delete("query");
        }
        router.replace(`/search?${params.toString()}`);
      } else {
        setDebouncedQuery(query);
      }
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isSearchPage]);

  // Dropdown search (only active when NOT on the search page)
  const { data, isFetching } = useSearchProductsQuery({ query: debouncedQuery });
  const results: ISearchProduct[] = data?.data?.products ?? [];

  // Open dropdown when we have a query; close when empty (only off search page)
  useEffect(() => {
    if (!isSearchPage) {
      if (query.trim().length >= 2) {
        setOpen(true);
        setActiveIndex(-1);
      } else {
        setOpen(false);
      }
    }
  }, [query, isSearchPage]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigateTo = (product: ISearchProduct) => {
    setOpen(false);
    setQuery("");
    router.push(`/products/${product.slug}`);
  };

  const handleFullSearch = () => {
    if (!query.trim()) return;
    setOpen(false);
    if (isSearchPage) {
      // Already on search page — just update query param
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", query.trim());
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    } else {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setOpen(false);
    if (isSearchPage) {
      // Clear the query param and go back to plain search page
      router.push("/search");
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isSearchPage) {
      // On search page Enter just ensures latest query is applied
      if (e.key === "Enter") {
        e.preventDefault();
        handleFullSearch();
      } else if (e.key === "Escape") {
        inputRef.current?.blur();
      }
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateTo(results[activeIndex]);
      } else {
        handleFullSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = !isSearchPage && open && query.trim().length >= 2;
  const showEmpty = showDropdown && !isFetching && results.length === 0 && debouncedQuery.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          id="site-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (!isSearchPage && query.trim().length >= 2) setOpen(true);
          }}
          placeholder="Search for products…"
          autoComplete="off"
          className={cn(
            "h-11 rounded-none border pl-4 pr-20 text-sm",
            "focus-visible:outline-none focus-visible:ring-1",
            "transition-colors",
          )}
        />

        {/* Right side: clear + search icon */}
        <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-3">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleFullSearch}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search"
          >
            {isFetching && !isSearchPage ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Search className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown — only shown off search page */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 bg-popover border border-border border-t-0 shadow-xl overflow-hidden">
          {/* Results list */}
          {results.length > 0 && (
            <ul role="listbox" className="max-h-[420px] overflow-y-auto divide-y divide-border">
              {results.map((product, index) => (
                <li
                  key={product._id}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent blur before click
                    navigateTo(product);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                    index === activeIndex ? "bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-11 h-11 bg-muted overflow-hidden border border-border">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate leading-snug">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {product.subCategoryId?.title}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-sm font-semibold text-foreground">
                    {formatPrice(product.priceRange)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No products found for &quot;<span className="font-medium text-foreground">{debouncedQuery}</span>&quot;
            </div>
          )}

          {/* Footer — view all results */}
          {results.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleFullSearch();
              }}
              className="w-full px-4 py-2.5 text-xs font-medium text-center text-muted-foreground hover:text-foreground hover:bg-muted/50 border-t border-border transition-colors cursor-pointer"
            >
              View all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
