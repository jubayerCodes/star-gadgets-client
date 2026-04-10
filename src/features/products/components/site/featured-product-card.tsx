"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IFeaturedProduct, ProductStatus } from "../../types/product.types";
import { useCartStore } from "@/store/cartStore";

interface FeaturedProductCardProps {
  product: IFeaturedProduct;
}

const stockLabel: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: "In Stock",
  [ProductStatus.OUT_OF_STOCK]: "Out of Stock",
  [ProductStatus.PRE_ORDER]: "Pre Order",
  [ProductStatus.COMING_SOON]: "Coming Soon",
};

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const { _id: productId, title, slug, badges, brand, category, featuredVariant } = product;
  const { featuredImage, price, regularPrice, status, sku, _id: variantId, attributes } = featuredVariant;

  const addItem = useCartStore((s) => s.addItem);

  const actualPrice = price ?? regularPrice;
  const hasDiscount = price !== undefined && price < regularPrice;

  const handleAddToCart = () => {
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
      {/* ── Image area ── */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {/* Image link */}
        <Link href={`/products/${slug}`} className="absolute inset-0 z-0" aria-label={title}>
          <Image
            src={featuredImage || "/placeholder.png"}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </Link>

        {/* Left badges — stacked, solid dark blocks */}
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

        {/* Stock badge — top right, hidden when in stock */}
        {status !== ProductStatus.IN_STOCK && (
          <span
            className={`absolute top-2 right-2 z-10 inline-flex items-center justify-center px-2 py-1 text-xs font-medium uppercase tracking-wide bg-foreground text-background leading-tight`}
          >
            {stockLabel[status]}
          </span>
        )}

        {/* ATC bar — slides up from bottom on hover */}
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

      {/* ── Body — centered ── */}
      <div className="flex flex-col items-center gap-1 px-3 pt-3 pb-4 border-t border-border">
        <Link
          href={`/products/${slug}`}
          className="text-base font-semibold text-center leading-snug text-foreground line-clamp-2 hover:text-tartiary transition-colors duration-200"
        >
          {title}
        </Link>

        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          {category.title}
          {brand?.title ? `, ${brand.title}` : ""}
        </p>

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
