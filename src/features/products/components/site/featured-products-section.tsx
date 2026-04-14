"use client";

import { useGetFeaturedProductsQuery } from "../../hooks/useProducts";
import FeaturedProductCard from "./featured-product-card";

const SKELETON_COUNT = 5;

function FeaturedProductsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="border border-border bg-card overflow-hidden">
          {/* Image placeholder */}
          <div className="aspect-square bg-muted animate-pulse" />
          {/* Body — mirrors centered FeaturedProductCard layout */}
          <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-4 border-t border-border">
            <div className="h-3 bg-muted animate-pulse rounded w-full" />
            <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/5 mt-1" />
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
