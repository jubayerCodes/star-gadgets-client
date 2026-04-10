"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ICartItem, selectCartCount, selectCartSubtotal, useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

function CartItem({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: ICartItem;
  onRemove: () => void;
  onUpdateQty: (qty: number) => void;
}) {
  return (
    <div className="flex gap-3 py-3">
      <Link
        href={`/products/${item.slug}`}
        className="relative size-20 shrink-0 rounded-lg border bg-muted overflow-hidden"
      >
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.title}
          fill
          className="object-contain p-1.5"
          sizes="80px"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          href={`/products/${item.slug}`}
          className="text-sm font-medium line-clamp-2 leading-snug hover:text-tartiary transition-colors"
        >
          {item.title}
        </Link>

        {item.attributes && item.attributes.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {item.attributes.map((a) => `${a.name}: ${a.value}`).join(", ")}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Qty controls */}
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.quantity - 1)}
              className="px-2 py-1.5 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="px-3 text-sm font-semibold min-w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.quantity + 1)}
              className="px-2 py-1.5 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">
              ৳{(item.price * item.quantity).toLocaleString()}
            </span>
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
    </div>
  );
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalItems = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0">
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <ShoppingBag className="size-5" />
            Shopping Cart
            {totalItems > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
          <button
            onClick={closeCart}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <ShoppingBag className="size-16 text-muted-foreground/20" />
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add some products and they&apos;ll show up here.
              </p>
              <Button variant="outline" size="sm" onClick={closeCart} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {items.map((item) => (
                <CartItem
                  key={item.variantId}
                  item={item}
                  onRemove={() => removeItem(item.variantId)}
                  onUpdateQty={(q) => updateQuantity(item.variantId, q)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">Subtotal</span>
              <span className="text-xl font-bold">৳{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Separator />
            <Button className="w-full h-11 font-semibold" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full h-10" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
