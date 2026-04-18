import SubCategoryProductsContent from "@/features/products/components/site/sub-category-products-content";
import { Suspense } from "react";

export const metadata = {
  title: "Sub-Category Products — Star Gadgets",
  description:
    "Browse products by sub-category at Star Gadgets. Filter by brand, price and availability.",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SubCategoryPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SubCategoryPageSkeleton />}>
      <SubCategoryProductsContent subCategorySlug={slug} />
    </Suspense>
  );
}

// ─── Loading skeleton shown during Suspense ───────────────────────────────────

function CardSkeleton() {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-4 border-t border-border">
        <div className="h-3 bg-muted animate-pulse rounded w-full" />
        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/5 mt-1" />
      </div>
    </div>
  );
}

function SubCategoryPageSkeleton() {
  return (
    <div className="container py-8 overflow-x-hidden">
      {/* Breadcrumb stub */}
      <div className="h-4 w-56 bg-muted animate-pulse rounded mb-5" />

      {/* Page header + search bar stub */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="h-7 w-48 bg-muted animate-pulse rounded" />
        <div className="sm:ml-auto flex gap-0">
          <div className="h-9 w-64 bg-muted animate-pulse" />
          <div className="h-9 w-20 bg-muted animate-pulse ml-0.5" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
          {[4, 2, 4].map((rows, i) => (
            <div key={i} className="border border-border p-4 flex flex-col gap-3">
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              {Array.from({ length: rows }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 bg-muted animate-pulse rounded"
                  style={{ width: `${85 - j * 10}%` }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter stub */}
          <div className="flex lg:hidden mb-4">
            <div className="h-9 w-28 bg-muted animate-pulse" />
          </div>
          {/* Toolbar stub */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-5">
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            <div className="flex items-center gap-2 sm:ml-auto">
              <div className="h-4 w-10 bg-muted animate-pulse rounded" />
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-9 w-9 bg-muted animate-pulse" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
