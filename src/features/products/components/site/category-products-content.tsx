"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetCategoryProductsQuery, useGetCategoryFiltersQuery } from "@/features/products/hooks/useProducts";
import Image from "next/image";
import Link from "next/link";
import { ICategorySubCategory, ISearchBrand, ISearchProduct, ProductStatus } from "../../types/product.types";
import { ChevronLeft, ChevronRight, LayoutGrid, Loader2, PackageSearch, Search, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { PRODUCT_LISTING } from "@/constants";
import ProductFilterSidebar, {
  FilterToggleButton,
  type FilterSectionConfig,
} from "@/components/filters/product-filter-sidebar";
import SiteBreadcrumb from "@/components/shared/site-breadcrumb";

// ─── helpers ─────────────────────────────────────────────────────────────────

const stockLabel: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: "In Stock",
  [ProductStatus.OUT_OF_STOCK]: "Out of Stock",
  [ProductStatus.PRE_ORDER]: "Pre Order",
  [ProductStatus.COMING_SOON]: "Coming Soon",
};

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ISearchProduct }) {
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
        {status !== ProductStatus.IN_STOCK && (
          <span className="absolute top-2 right-2 z-10 inline-flex items-center justify-center px-2 py-1 text-xs font-medium uppercase tracking-wide bg-foreground text-background leading-tight">
            {stockLabel[status]}
          </span>
        )}
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
          <p className="text-xs text-center text-muted-foreground leading-relaxed">{subCategoryId?.title}</p>
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

function ProductCardSkeleton() {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-4 border-t border-border">
        <div className="h-3 bg-muted animate-pulse rounded w-full" />
        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/5 mt-1" />
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

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

// ─── Category Not Found state ─────────────────────────────────────────────────

function CategoryNotFound({ slug }: { slug: string }) {
  return (
    <div className="container py-20 min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <LayoutGrid className="size-12 text-muted-foreground/50" />
      <div>
        <p className="text-base font-medium text-foreground">Category not found</p>
        <p className="text-sm text-muted-foreground mt-1">
          No category matches <strong>&ldquo;{slug}&rdquo;</strong>. It may have been removed or renamed.
        </p>
      </div>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/products">Browse all products</Link>
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const sortLabels: Record<string, string> = {
  newest: "Newest",
  priceAsc: "Price: Low → High",
  priceDesc: "Price: High → Low",
  popularity: "Popularity",
};

export default function CategoryProductsContent({ categorySlug }: { categorySlug: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Read URL params ──
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(PRODUCT_LISTING.DEFAULT_PAGE)));
  const limit = parseInt(searchParams.get("limit") ?? String(PRODUCT_LISTING.DEFAULT_LIMIT));
  const searchParam = searchParams.get("search") ?? "";
  const sortBy = (searchParams.get("sortBy") ?? "newest") as "newest" | "priceAsc" | "priceDesc" | "popularity";
  const minPriceParam = searchParams.get("minPrice") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const availabilityParam = searchParams.get("availability") ?? "";
  const brandParam = searchParams.get("brand") ?? "";
  const subCategoryParam = searchParams.get("subCategory") ?? "";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParam);

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  const availability: string[] = availabilityParam ? availabilityParam.split(",") : [];
  const selectedBrands: string[] = brandParam ? brandParam.split(",") : [];
  const selectedSubCategories: string[] = subCategoryParam ? subCategoryParam.split(",") : [];

  // ── Fetch ──
  const { data, isLoading, isFetching, isError } = useGetCategoryProductsQuery({
    categorySlug,
    page,
    limit,
    search: searchParam || undefined,
    minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
    maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
    availability: availability[0] as "inStock" | "outOfStock" | undefined,
    brand: selectedBrands[0],
    subCategory: selectedSubCategories[0],
    sortBy,
  });

  const { data: filtersData } = useGetCategoryFiltersQuery(categorySlug);

  const categoryMeta = filtersData?.data?.category;
  const results: ISearchProduct[] = data?.data?.products ?? [];
  const brands: ISearchBrand[] = filtersData?.data?.brands ?? [];
  const subCategories: ICategorySubCategory[] = filtersData?.data?.subCategories ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  // ── URL helpers ──
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === "") params.delete(k);
        else params.set(k, v);
      });
      if (!updates.page) params.set("page", "1");
      router.push(`/categories/${categorySlug}?${params.toString()}`);
    },
    [searchParams, router, categorySlug],
  );

  const navigatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/categories/${categorySlug}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: localSearch.trim() || undefined });
  };

  const handleClearAll = () => router.push(`/categories/${categorySlug}`);
  const handleLimitChange = (val: number) => updateParams({ limit: String(val) });

  const hasActiveFilters = !!(
    searchParam ||
    minPriceParam ||
    maxPriceParam ||
    availability.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSubCategories.length > 0 ||
    sortBy !== "newest"
  );

  // ── Build dynamic filter sections ──
  // Sections are driven by data from the API — if sub-categories or brands
  // are empty they are simply hidden by the CheckboxSection renderer.
  const filterSections: FilterSectionConfig[] = [
    {
      type: "radio",
      label: "Sort By",
      radioGroupName: "category-sortBy",
      options: [
        { value: "newest", label: "Newest" },
        { value: "priceAsc", label: "Price: Low → High" },
        { value: "priceDesc", label: "Price: High → Low" },
        { value: "popularity", label: "Popularity" },
      ],
      value: sortBy,
      onChange: (val) => updateParams({ sortBy: val === "newest" ? undefined : val }),
    },
    {
      type: "priceRange",
      label: "Price Range",
      min: minPriceParam,
      max: maxPriceParam,
      onApply: (min, max) => updateParams({ minPrice: min || undefined, maxPrice: max || undefined }),
    },
    {
      type: "checkbox",
      label: "Availability",
      options: [
        { value: "inStock", label: "In Stock" },
        { value: "outOfStock", label: "Out of Stock" },
      ],
      selected: availability,
      onChange: (next) => updateParams({ availability: next.join(",") || undefined }),
      singleSelect: true,
    },
    // ── Dynamic: sub-categories of this category ──
    {
      type: "checkbox",
      label: "Sub-category",
      options: subCategories.map((sc) => ({ value: sc.slug, label: sc.title })),
      selected: selectedSubCategories,
      onChange: (next) => updateParams({ subCategory: next.join(",") || undefined }),
      scrollable: subCategories.length > 6,
      singleSelect: true,
    },
    // ── Dynamic: brands available in this category ──
    {
      type: "checkbox",
      label: "Brand",
      options: brands.map((b) => ({ value: b.slug, label: b.title })),
      selected: selectedBrands,
      onChange: (next) => updateParams({ brand: next.join(",") || undefined }),
      scrollable: brands.length > 6,
      singleSelect: true,
    },
  ];

  // ── Category not found (404 from server) ──
  if (isError) return <CategoryNotFound slug={categorySlug} />;

  return (
    <div className="container py-8 min-h-[60vh] overflow-x-hidden">
      {/* ── Breadcrumb ── */}
      <SiteBreadcrumb className="mb-5" items={[...(categoryMeta ? [{ label: categoryMeta.title }] : [])]} />

      {/* ── Page header + Search bar ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {isLoading && !categoryMeta ? (
            <div className="h-7 w-48 bg-muted animate-pulse rounded" />
          ) : (
            <h1 className="text-xl font-semibold text-foreground">
              {categoryMeta ? `${categoryMeta.title} Products` : "Category Products"}
            </h1>
          )}
          {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {!isLoading && !isFetching && total > 0 && (
            <span className="text-sm text-muted-foreground">
              ({total} product{total !== 1 ? "s" : ""})
            </span>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center sm:ml-auto w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              id="category-search-input"
              type="text"
              placeholder={`Search in ${categoryMeta?.title ?? "category"}…`}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Button type="submit" size="sm" className="rounded-none h-9 px-4">
            Search
          </Button>
          {searchParam && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                updateParams({ search: undefined });
              }}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </form>
      </div>

      {/* ── Active filter chips ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {searchParam && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border bg-muted text-foreground">
              Search: <strong>{searchParam}</strong>
              <button onClick={() => updateParams({ search: undefined })} aria-label="Remove search filter">
                <X className="size-3 ml-0.5" />
              </button>
            </span>
          )}
          {selectedSubCategories.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border bg-muted text-foreground"
            >
              Sub-cat: <strong>{subCategories.find((x) => x.slug === s)?.title ?? s}</strong>
              <button
                onClick={() => {
                  const next = selectedSubCategories.filter((x) => x !== s);
                  updateParams({ subCategory: next.join(",") || undefined });
                }}
                aria-label="Remove sub-category filter"
              >
                <X className="size-3 ml-0.5" />
              </button>
            </span>
          ))}
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border bg-muted text-foreground"
            >
              Brand: <strong>{brands.find((x) => x.slug === b)?.title ?? b}</strong>
              <button
                onClick={() => {
                  const next = selectedBrands.filter((x) => x !== b);
                  updateParams({ brand: next.join(",") || undefined });
                }}
                aria-label="Remove brand filter"
              >
                <X className="size-3 ml-0.5" />
              </button>
            </span>
          ))}
          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border bg-muted text-foreground">
              Price:{" "}
              <strong>
                ৳{minPriceParam || "0"} – ৳{maxPriceParam || "∞"}
              </strong>
              <button
                onClick={() => updateParams({ minPrice: undefined, maxPrice: undefined })}
                aria-label="Remove price filter"
              >
                <X className="size-3 ml-0.5" />
              </button>
            </span>
          )}
          {availability.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-border bg-muted text-foreground"
            >
              {a === "inStock" ? "In Stock" : "Out of Stock"}
              <button
                onClick={() => {
                  const next = availability.filter((x) => x !== a);
                  updateParams({ availability: next.join(",") || undefined });
                }}
                aria-label="Remove availability filter"
              >
                <X className="size-3 ml-0.5" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs text-tartiary hover:underline underline-offset-4 transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* Mobile filter toggle */}
        <FilterToggleButton onClick={() => setDrawerOpen(true)} hasActiveFilters={hasActiveFilters} />

        {/* Reusable sidebar — sections built dynamically per category */}
        <ProductFilterSidebar
          sections={filterSections}
          hasActiveFilters={hasActiveFilters}
          onClearAll={handleClearAll}
          mobileOpen={drawerOpen}
          onMobileClose={() => setDrawerOpen(false)}
        />

        {/* Grid area */}
        <div className="flex-1 min-w-0 w-full">
          {/* Toolbar */}
          {!isLoading && total > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
              <p className="text-sm text-muted-foreground">
                Sorted by: <span className="font-medium text-foreground">{sortLabels[sortBy] ?? "Newest"}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                {PRODUCT_LISTING.LIMIT_OPTIONS.map((opt) => (
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
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <PackageSearch className="size-12 text-muted-foreground/50" />
              <div>
                <p className="text-base font-medium text-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters
                    ? "Try adjusting or clearing your filters."
                    : `No products are available in this category right now.`}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-sm font-medium text-tartiary hover:underline underline-offset-4"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results grid */}
          {!isLoading && results.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
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
    </div>
  );
}
