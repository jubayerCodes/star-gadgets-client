"use client";

import Image from "next/image";
import { ICartItem } from "@/store/cartStore";
import { IShippingMethod } from "@/features/config/types";
import { IAppliedCoupon } from "../types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  items: ICartItem[];
  shippingMethods: IShippingMethod[];
  selectedShipping: string;
  appliedCoupon: IAppliedCoupon | null;
  isSubmitting: boolean;
}

export default function OrderSummary({
  items,
  shippingMethods,
  selectedShipping,
  appliedCoupon,
  isSubmitting,
}: OrderSummaryProps) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCost = shippingMethods.find((m) => m.name === selectedShipping)?.cost ?? 0;
  const discount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal + shippingCost - discount;

  return (
    <div className="bg-card border border-border overflow-hidden shadow-sm flex flex-col sticky top-24">
      <h2 className="text-xl font-bold text-primary-foreground px-6 py-4 bg-primary tracking-tight">Your Order</h2>

      {/* Header row */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-muted/40">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-border">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.variantId} className="flex items-start justify-between gap-3 px-6 py-4">
              <div className="flex items-start gap-3 flex-1">
                {item.image && (
                  <div className="relative size-14 border border-border bg-muted shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-contain" />
                  </div>
                )}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                  {item.attributes?.map((attr) => (
                    <p key={attr.name} className="text-xs text-muted-foreground">
                      {attr.name}: {attr.value}
                    </p>
                  ))}
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground shrink-0">৳{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex items-start justify-between gap-2 text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
        </div>

        {appliedCoupon && (
          <div className="flex items-start justify-between gap-2 text-sm text-green-700">
            <span>Coupon ({appliedCoupon.code})</span>
            <span className="font-semibold text-green-600">− ৳{discount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-2 text-sm">
          <span>Shipping</span>
          <div className="flex flex-col items-end gap-0.5">
            {shippingMethods.length === 0 ? (
              <span className="text-muted-foreground text-xs">No methods available</span>
            ) : (
              shippingMethods.map((method) => (
                <span
                  key={method.name}
                  className={
                    method.name === selectedShipping
                      ? "text-foreground font-semibold text-sm"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {method.name}: ৳{method.cost}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-base font-bold text-foreground mt-1">
          <span>Total</span>
          <span>৳{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Place order */}
      <div className="px-6 pb-5 pt-4">
        <Button
          id="place-order-btn"
          type="submit"
          form="checkout-form"
          disabled={isSubmitting || items.length === 0}
          className="w-full rounded-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Processing…
            </span>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground px-6 pb-5 leading-relaxed">
        Your personal data will be used to process your order, support your experience throughout this website, and for
        other purposes described in our{" "}
        <a href="/privacy-policy" className="text-tartiary font-medium hover:underline transition">
          privacy policy
        </a>
        .
      </p>
    </div>
  );
}
