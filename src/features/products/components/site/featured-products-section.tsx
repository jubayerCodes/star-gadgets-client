"use client";

import { useGetFeaturedProductsQuery } from "../../hooks/useProducts";
import FeaturedProductCard from "./featured-product-card";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COUNT = 5;

function FeaturedProductsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-col border border-border overflow-hidden">
          <Skeleton className="w-full aspect-square" />
          <div className="flex flex-col items-center gap-2 p-3">
            <Skeleton className="h-3 w-1/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedProductsSection() {
  const { data, isLoading, isError } = useGetFeaturedProductsQuery();
  const products = data?.data ?? [];

  if (isError) return null;

  return (
    <section className="py-10">
      <div className="container">

        {/* ── Section header ── */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {/* Title row with flanking lines */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-xl font-bold uppercase tracking-wide text-foreground whitespace-nowrap">
              Featured Products
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          {/* Description */}
          <p className="text-sm text-center text-muted-foreground max-w-2xl leading-relaxed">
            Star Gadgets offers a wide variety of quality keyboards, mice, headphones, gamepads,
            and all types of tech accessories — bringing you comfort, value, and performance.
          </p>
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <FeaturedProductsSkeleton />
        ) : products.length === 0 ? null : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <FeaturedProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
