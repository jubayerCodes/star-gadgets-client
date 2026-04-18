"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, ExternalLink, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IWishlistItem, useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

const formatRelativeTime = (date: Date) => {
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

const WishlistContent = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="container py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">My Wishlist</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {items.length === 0
                  ? "Your wishlist is empty"
                  : `${items.length} saved item${items.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              Clear all
            </Button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && <WishlistEmpty />}

        {/* List */}
        {items.length > 0 && (
          <div className="flex flex-col divide-y divide-border border border-border">
            {items.map((item) => (
              <WishlistRow key={item.productId} item={item} onRemove={() => removeItem(item.productId)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Empty State ─────────────────────────────────────────────────────────── */

function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <PackageOpen size={36} className="text-muted-foreground" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground mb-1">No saved products yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Browse products and click{" "}
          <span className="font-medium text-tartiary">Add to Wishlist</span> to save them here.
        </p>
      </div>
      <Button asChild className="mt-2 rounded-none">
        <Link href="/">Start Browsing</Link>
      </Button>
    </div>
  );
}

/* ─── Wishlist Row ────────────────────────────────────────────────────────── */

interface WishlistRowProps {
  item: IWishlistItem;
  onRemove: () => void;
}

function WishlistRow({ item, onRemove }: WishlistRowProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { slug, title, image, price, regularPrice, category, brand, addedAt, productId } = item;

  const hasDiscount = price < regularPrice;
  const discountPercent = hasDiscount ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      productId,
      slug,
      title,
      image,
      variantId: productId, // fallback; detail page handles variant selection
      sku: "",
      price,
      regularPrice,
    });
  };

  return (
    <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-card hover:bg-muted/30 transition-colors">
      {/* Image */}
      <Link href={`/products/${slug}`} className="shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 border border-border bg-white overflow-hidden">
          <Image
            src={image || "/placeholder.png"}
            alt={title}
            fill
            sizes="96px"
            className="object-contain p-1.5"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${slug}`}
          className="text-sm sm:text-base font-semibold text-foreground hover:text-tartiary transition-colors line-clamp-2 leading-snug"
        >
          {title}
        </Link>

        {/* Meta: category · brand */}
        {(category || brand) && (
          <p className="text-xs text-muted-foreground mt-1">
            {[category, brand].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          <span className="text-base font-bold text-foreground">
            ৳{price.toLocaleString("en-BD")}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ৳{regularPrice.toLocaleString("en-BD")}
              </span>
              <span className="text-[10px] font-bold bg-tartiary text-white px-1.5 py-0.5 leading-none">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {/* Added time */}
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Added {formatRelativeTime(new Date(addedAt))}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
        <Button
          size="sm"
          className="rounded-none gap-1.5 h-9 text-xs whitespace-nowrap"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={13} />
          <span className="hidden sm:inline">Add to Cart</span>
          <span className="sm:hidden">Cart</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          asChild
          className="rounded-none gap-1.5 h-9 text-xs border-border"
        >
          <Link href={`/products/${slug}`}>
            <ExternalLink size={13} />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>

        <button
          onClick={onRemove}
          aria-label="Remove from wishlist"
          className="p-2 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default WishlistContent;
