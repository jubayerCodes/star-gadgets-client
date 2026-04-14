"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSearchProductsQuery } from "@/features/products/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import { ISearchBrand, ISearchProduct, ProductStatus } from "../../types/product.types";
import { ChevronLeft, ChevronRight, Home, Loader2, SearchX, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────

const stockLabel: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: "In Stock",
  [ProductStatus.OUT_OF_STOCK]: "Out of Stock",
  [ProductStatus.PRE_ORDER]: "Pre Order",
  [ProductStatus.COMING_SOON]: "Coming Soon",
};

// ─── Search Product Card (matches FeaturedProductCard design) ─────────────────

function SearchProductCard({ product }: { product: ISearchProduct }) {
  const { _id: productId, title, slug, badges, subCategoryId, featuredVariant } = product;

  const addItem = useCartStore((s) => s.addItem);

  const { featuredImage, price, regularPrice, status, sku, _id: variantId, attributes } = featuredVariant;

  const actualPrice = price ?? regularPrice;
  const hasDiscount = price !== undefined && price < regularPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId,
      slug,
      title,
      image: featuredImage,
      variantId: variantId ?? sku,
      sku,
      price: actualPrice,
      regularPrice,
      attributes,
    });
  };

  return (
    <article className="group flex flex-col border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-md">
      {/* Image area */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Link href={`/products/${slug}`} className="absolute inset-0 z-0" aria-label={title}>
          <Image
            src={featuredImage || "/placeholder.png"}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </Link>

        {/* Left badges */}
        {badges && badges.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium uppercase tracking-wide bg-foreground text-background leading-tight"
              >
                {badge.title}
              </span>
            ))}
          </div>
        )}

        {/* Stock badge */}
        {status !== ProductStatus.IN_STOCK && (
          <span className="absolute top-2 right-2 z-10 inline-flex items-center justify-center px-2 py-1 text-xs font-medium uppercase tracking-wide bg-foreground text-background leading-tight">
            {stockLabel[status]}
          </span>
        )}

        {/* ATC bar — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 z-10 opacity-0 translate-y-full transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          {status !== ProductStatus.IN_STOCK ? (
            <Button asChild className="w-full rounded-none">
              <Link href={`/products/${slug}`}>Details</Link>
            </Button>
          ) : (
            <Button className="w-full rounded-none" onClick={handleAddToCart}>
              <ShoppingCart size={13} />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-1 px-3 pt-3 pb-4 border-t border-border">
        <Link
          href={`/products/${slug}`}
          className="text-base font-semibold text-center leading-snug text-foreground line-clamp-2 hover:text-tartiary transition-colors duration-200"
        >
          {title}
        </Link>

        {subCategoryId?.slug ? (
          <Link
            href={`/sub-categories/${subCategoryId.slug}`}
            className="text-xs text-center text-muted-foreground leading-relaxed hover:text-tartiary transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {subCategoryId.title}
          </Link>
        ) : (
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            {subCategoryId?.title}
          </p>
        )}

        <div className="flex items-baseline justify-center gap-2 mt-1">
          <span className="text-base font-bold text-foreground">
            ৳{actualPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{regularPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────

function SearchResultSkeleton() {
  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square bg-muted animate-pulse" />
      {/* Body — mirrors centered card layout */}
      <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-4 border-t border-border">
        <div className="h-3 bg-muted animate-pulse rounded w-full" />
        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/5 mt-1" />
      </div>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onNavigate,
}: {
  page: number;
  totalPages: number;
  onNavigate: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onNavigate(page - 1)}
        disabled={page <= 1}
        className="flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {getPages().map((p, i) =>
        p === "…" ? (
          <span
            key={`e-${i}`}
            className="flex items-center justify-center w-9 h-9 text-sm text-muted-foreground select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onNavigate(p as number)}
            className={cn(
              "flex items-center justify-center w-9 h-9 text-sm border transition-colors",
              p === page
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "border-border text-foreground hover:bg-muted",
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onNavigate(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center justify-center w-9 h-9 border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

// ─── Filter Sidebar ────────────────────────────────────────────────────────────

interface FilterSidebarProps {
  brands: ISearchBrand[];
  // current filter values
  minPrice: string;
  maxPrice: string;
  availability: string[];
  selectedBrands: string[];
  sortBy: string;
  onApplyPrice: (min: string, max: string) => void;
  onToggleAvailability: (val: string) => void;
  onToggleBrand: (slug: string) => void;
  onSortChange: (val: string) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  brands,
  minPrice,
  maxPrice,
  availability,
  selectedBrands,
  sortBy,
  onApplyPrice,
  onToggleAvailability,
  onToggleBrand,
  onSortChange,
  onClearAll,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  // sync external changes (e.g. clear all)
  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);
  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "priceAsc", label: "Price: Low → High" },
    { value: "priceDesc", label: "Price: High → Low" },
    { value: "newest", label: "Newest" },
  ];

  const hasActiveFilters =
    minPrice || maxPrice || availability.length > 0 || selectedBrands.length > 0 || sortBy !== "relevance";

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-tartiary hover:underline underline-offset-4 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="border border-border p-4 flex flex-col gap-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Sort By</p>
        <div className="flex flex-col gap-2">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => onSortChange(opt.value)}
                className="accent-foreground"
              />
              <span className="text-sm text-foreground group-hover:text-tartiary transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border border-border p-4 flex flex-col gap-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="w-full h-9 px-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="w-full h-9 px-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Button size="sm" variant="outline" className="w-full" onClick={() => onApplyPrice(localMin, localMax)}>
          Apply
        </Button>
      </div>

      {/* Availability */}
      <div className="border border-border p-4 flex flex-col gap-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Availability</p>
        <div className="flex flex-col gap-2">
          {[
            { value: "inStock", label: "In Stock" },
            { value: "outOfStock", label: "Out of Stock" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={availability.includes(opt.value)}
                onChange={() => onToggleAvailability(opt.value)}
                className="accent-foreground"
              />
              <span className="text-sm text-foreground group-hover:text-tartiary transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="border border-border p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Brand</p>
          <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand._id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => onToggleBrand(brand.slug)}
                  className="accent-foreground"
                />
                <span className="text-sm text-foreground group-hover:text-tartiary transition-colors truncate">
                  {brand.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const LIMIT_OPTIONS = [12, 20, 40];

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const sortBy = (searchParams.get("sortBy") ?? "relevance") as "relevance" | "priceAsc" | "priceDesc" | "newest";
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const availabilityParam = searchParams.get("availability") ?? "";
  const brandParam = searchParams.get("brand") ?? "";

  // Mobile filter drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Parse array-like params
  const availability: string[] = availabilityParam ? availabilityParam.split(",") : [];
  const selectedBrands: string[] = brandParam ? brandParam.split(",") : [];

  const { data, isLoading, isFetching } = useSearchProductsQuery({
    query,
    page,
    limit,
    minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
    maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
    // Send only first availability if set (API takes single value)
    availability: availability[0] as "inStock" | "outOfStock" | undefined,
    // Send only first brand if set
    brand: selectedBrands[0],
    sortBy,
  });

  const results: ISearchProduct[] = data?.data?.products ?? [];
  const brands: ISearchBrand[] = data?.data?.brands ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  // URL helpers
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === "") {
          params.delete(k);
        } else {
          params.set(k, v);
        }
      });
      // Reset page on filter change
      if (!updates.page) params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    },
    [searchParams, router],
  );

  const navigatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/search?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyPrice = (min: string, max: string) => {
    updateParams({ minPrice: min || undefined, maxPrice: max || undefined });
  };

  const handleToggleAvailability = (val: string) => {
    const next = availability.includes(val) ? availability.filter((a) => a !== val) : [...availability, val];
    updateParams({ availability: next.join(",") || undefined });
  };

  const handleToggleBrand = (slug: string) => {
    const next = selectedBrands.includes(slug) ? selectedBrands.filter((b) => b !== slug) : [...selectedBrands, slug];
    updateParams({ brand: next.join(",") || undefined });
  };

  const handleSortChange = (val: string) => {
    updateParams({ sortBy: val === "relevance" ? undefined : val });
  };

  const handleClearAll = () => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleLimitChange = (val: number) => {
    updateParams({ limit: String(val) });
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortLabels: Record<string, string> = {
    relevance: "Relevance",
    priceAsc: "Price: Low → High",
    priceDesc: "Price: High → Low",
    newest: "Newest",
  };

  return (
    <div className="container py-8 min-h-[60vh] overflow-x-hidden">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="size-3.5" />
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="select-none">
            /
          </li>
          <li>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
          </li>
          {query && (
            <>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
                Search results for &ldquo;{query}&rdquo;
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* ── Query Banner ── */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <h1 className="text-xl font-semibold text-foreground">
          {query ? (
            <>
              Search results for <span className="text-tartiary">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        {!isLoading && !isFetching && total > 0 && (
          <span className="text-sm text-muted-foreground">
            ({total} product{total !== 1 ? "s" : ""})
          </span>
        )}
      </div>

      {/* ── No query ── */}
      {!isLoading && query.trim().length < 2 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
          <p className="text-sm">Enter at least 2 characters to search for products.</p>
        </div>
      )}

      {/* ── Main layout: sidebar + grid ── */}
      {query.trim().length >= 2 && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Mobile filter toggle */}
          <div className="flex lg:hidden w-full">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="size-4" />
              Filters
              {(availability.length > 0 ||
                selectedBrands.length > 0 ||
                minPriceParam ||
                maxPriceParam ||
                sortBy !== "relevance") && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-foreground text-background font-bold">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Mobile drawer */}
          {drawerOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
              {/* Panel */}
              <div
                ref={drawerRef}
                className="relative z-10 w-80 max-w-[85vw] bg-background h-full overflow-y-auto p-5 flex flex-col gap-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold">Filters</span>
                  <button onClick={() => setDrawerOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="size-5" />
                  </button>
                </div>
                <FilterSidebar
                  brands={brands}
                  minPrice={minPriceParam}
                  maxPrice={maxPriceParam}
                  availability={availability}
                  selectedBrands={selectedBrands}
                  sortBy={sortBy}
                  onApplyPrice={handleApplyPrice}
                  onToggleAvailability={handleToggleAvailability}
                  onToggleBrand={handleToggleBrand}
                  onSortChange={handleSortChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              brands={brands}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              availability={availability}
              selectedBrands={selectedBrands}
              sortBy={sortBy}
              onApplyPrice={handleApplyPrice}
              onToggleAvailability={handleToggleAvailability}
              onToggleBrand={handleToggleBrand}
              onSortChange={handleSortChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Grid area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: sort label + limit */}
            {!isLoading && total > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                <p className="text-sm text-muted-foreground">
                  Sorted by: <span className="font-medium text-foreground">{sortLabels[sortBy] ?? "Relevance"}</span>
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  {LIMIT_OPTIONS.map((opt) => (
                    <Button
                      key={opt}
                      variant="outline"
                      onClick={() => handleLimitChange(opt)}
                      className={cn(
                        "flex items-center justify-center w-9 h-9 text-sm border transition-colors",
                        limit === opt
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "border-border text-foreground",
                      )}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: limit }).map((_, i) => (
                  <SearchResultSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && results.length === 0 && query.trim().length >= 2 && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <SearchX className="size-12 text-muted-foreground/50" />
                <div>
                  <p className="text-base font-medium text-foreground">No products found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search term or adjust your filters.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center mt-2">
                  <button
                    onClick={handleClearAll}
                    className="text-sm font-medium text-tartiary hover:underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                  <Link href="/" className="text-sm font-medium text-tartiary hover:underline underline-offset-4">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Results grid */}
            {!isLoading && results.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((product) => (
                    <SearchProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination page={page} totalPages={totalPages} onNavigate={navigatePage} />

                {totalPages > 1 && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Page {page} of {totalPages}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
