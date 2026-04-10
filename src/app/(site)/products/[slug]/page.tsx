"use client";

import { use } from "react";
import { useGetProductBySlugQuery } from "@/features/products/hooks/useProducts";
import ProductDetail from "@/features/products/components/site/product-detail";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-3 flex items-center gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Image gallery skeleton */}
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[72px] h-[72px] shrink-0" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-8 w-40 mt-1" />
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !data?.data) return notFound();

  return <ProductDetail product={data.data} />;
}
