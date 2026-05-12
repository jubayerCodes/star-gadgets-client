"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICartItem, selectCartSubtotal, useCartStore } from "@/store/cartStore";
import SiteBreadcrumb from "@/components/shared/site-breadcrumb";

// ── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: ICartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}) {
  const lineTotal = item.price * item.quantity;
  const hasDiscount = item.regularPrice > item.price;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 py-5 border-b border-border last:border-0">
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative size-20 shrink-0 border border-border bg-muted overflow-hidden"
        aria-label={item.title}
      >
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.title}
          fill
          className="object-contain p-2"
          sizes="80px"
        />
      </Link>

      {/* Title + Attributes */}
      <div className="flex flex-col gap-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="text-sm font-semibold leading-snug line-clamp-2 hover:text-tartiary transition-colors"
        >
          {item.title}
        </Link>
        {item.attributes && item.attributes.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {item.attributes.map((a) => `${a.name}: ${a.value}`).join(" · ")}
          </p>
        )}
        {/* Unit price */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-semibold text-foreground">৳{item.price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">৳{item.regularPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Mobile-only controls */}
        <div className="flex items-center justify-between mt-2 sm:hidden">
          {/* Qty stepper */}
          <div className="flex items-center border border-border overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="px-2.5 py-1.5 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="px-3 text-sm font-semibold min-w-8 text-center select-none">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="px-2.5 py-1.5 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">৳{lineTotal.toLocaleString()}</span>
            <button
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: Unit price (hidden — shown inline on mobile above) */}
      {/* Desktop: Qty stepper */}
      <div className="hidden sm:flex items-center border border-border overflow-hidden">
        <button
          onClick={() => onUpdateQty(item.quantity - 1)}
          className="px-2.5 py-1.5 hover:bg-muted transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="size-3" />
        </button>
        <span className="px-3 text-sm font-semibold min-w-8 text-center select-none">{item.quantity}</span>
        <button
          onClick={() => onUpdateQty(item.quantity + 1)}
          className="px-2.5 py-1.5 hover:bg-muted transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="size-3" />
        </button>
      </div>

      {/* Desktop: Line total */}
      <span className="hidden sm:block text-sm font-bold text-foreground text-right min-w-[80px]">
        ৳{lineTotal.toLocaleString()}
      </span>

      {/* Desktop: Remove */}
      <button
        onClick={onRemove}
        className="hidden sm:flex text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Remove item"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <ShoppingBag className="size-16 text-muted-foreground/25" strokeWidth={1.2} />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore our products and find something you love.
        </p>
      </div>
      <Button asChild className="mt-2 rounded-none gap-2">
        <Link href="/products">
          <ShoppingCart className="size-4" />
          Browse Products
        </Link>
      </Button>
    </div>
  );
}

// ── Cart Summary Sidebar ──────────────────────────────────────────────────────

function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <div className="bg-card border border-border overflow-hidden shadow-sm flex flex-col sticky top-24">
      <h2 className="text-xl font-bold text-primary-foreground px-6 py-4 bg-primary tracking-tight">Cart Totals</h2>

      <div className="flex flex-col gap-3 px-6 py-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">৳{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex items-start justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-xs text-muted-foreground text-right max-w-[160px]">Calculated at checkout</span>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between text-base font-bold text-foreground">
          <span>Total</span>
          <span>৳{subtotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        <Button asChild className="w-full rounded-none gap-2 h-11">
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-none h-10">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground px-6 pb-5 leading-relaxed">
        Taxes and shipping calculated at checkout. By placing your order, you agree to our{" "}
        <Link href="/terms" className="text-tartiary font-medium hover:underline transition">
          Terms & Conditions
        </Link>
        .
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CartContent() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <div className="pb-16">
      {/* ── Breadcrumb Banner ── */}
      <div className="bg-primary text-primary-foreground py-10 mb-8">
        <div className="container">
          <SiteBreadcrumb
            items={[{ label: "Cart" }]}
            className="[&_ol]:text-primary-foreground/70 [&_a]:text-primary-foreground/70 [&_a]:hover:text-primary-foreground [&_li]:text-primary-foreground/70 [&_li]:hover:text-primary-foreground [&_li[aria-current=page]]:text-primary-foreground [&_li[aria-current=page]]:font-semibold"
          />
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_340px] lg:items-start">
            {/* ── Left: Item Table ── */}
            <div className="bg-card border border-border overflow-hidden shadow-sm">
              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-6 py-3 border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <span className="w-20">Product</span>
                <span>Details</span>
                <span>Quantity</span>
                <span className="min-w-[80px] text-right">Subtotal</span>
                <span className="sr-only">Remove</span>
              </div>

              {/* Items */}
              <div className="px-6">
                {items.map((item) => (
                  <CartItemRow
                    key={item.variantId}
                    item={item}
                    onRemove={() => removeItem(item.variantId)}
                    onUpdateQty={(q) => updateQuantity(item.variantId, q)}
                  />
                ))}
              </div>

              {/* Clear cart */}
              <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"} in your cart
                </span>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* ── Right: Summary ── */}
            <CartSummary subtotal={subtotal} />
          </div>
        )}
      </div>
    </div>
  );
}
