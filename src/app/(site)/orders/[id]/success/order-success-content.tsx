"use client";

import { useOrderByIdQuery } from "@/features/checkout/hooks/useOrders";
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NotFoundMessage from "@/components/shared/not-found-message";
import Loading from "@/components/layout/loading";

export default function OrderSuccessContent({ id }: { id: string }) {
  const { data, isLoading, isError } = useOrderByIdQuery(id);
  const order = data?.data;

  if (isLoading) return <Loading />;

  if (isError || !order)
    return (
      <NotFoundMessage
        title="Order Not Found"
        description="We couldn't locate this order. The link may be incorrect or the order may no longer exist."
        backLabel="Continue Shopping"
        backHref="/"
      />
    );

  const {
    billingDetails,
    shippingDetails,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    orderNumber,
    coupon,
    paymentId: payment,
  } = order;

  // Show shipping address if the customer shipped to a different address, otherwise billing
  const deliveryAddress = shippingDetails ?? billingDetails;

  return (
    <div className="container py-12 max-w-3xl">
      {/* ── Success Header ────────────── */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle className="size-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Thank you for your order. Your order number is{" "}
          <span className="font-semibold text-foreground">{orderNumber}</span>.
        </p>
      </div>

      {/* ── Order Items ───────────────── */}
      <div className="border border-border mb-6">
        <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border">
          <Package className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Order Items</h2>
        </div>
        <div className="divide-y divide-border">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-4">
              {item.image && (
                <div className="relative size-14 border border-border shrink-0 overflow-hidden bg-muted">
                  <Image src={item.image} alt={item.title} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                {item.attributes?.map((a) => (
                  <p key={a.name} className="text-xs text-muted-foreground">
                    {a.name}: {a.value}
                  </p>
                ))}
                <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold shrink-0">৳{item.subtotal.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex flex-col gap-1.5 px-5 py-4 border-t border-border bg-muted/10 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          {coupon && (
            <div className="flex justify-between text-green-700">
              <span>Coupon ({coupon.code})</span>
              <span>− ৳{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping ({order.shippingMethod})</span>
            <span>৳{shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Billing & Payment Info ────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Delivery Address</h3>
          </div>
          <p className="text-sm text-foreground font-medium">
            {deliveryAddress.firstName} {deliveryAddress.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{deliveryAddress.streetAddress}</p>
          <p className="text-sm text-muted-foreground">
            {deliveryAddress.city}, {deliveryAddress.district}
            {deliveryAddress.postcode ? ` - ${deliveryAddress.postcode}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{deliveryAddress.phone}</p>
          {deliveryAddress.email && <p className="text-sm text-muted-foreground">{deliveryAddress.email}</p>}
        </div>

        <div className="border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Payment</h3>
          </div>
          {payment ? (
            <>
              <p className="text-sm font-medium capitalize">
                {payment.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {payment.paymentMethod === "cod"
                  ? "You will pay when the order is delivered."
                  : "Payment will be processed online."}
              </p>
              <p className="text-xs mt-2">
                Status:{" "}
                <span className={`font-semibold ${payment.status === "PAID" ? "text-green-600" : "text-amber-600"}`}>
                  {payment.status}
                </span>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Payment info unavailable</p>
          )}
        </div>
      </div>

      {/* ── CTAs ─────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex items-center justify-center px-6 py-2.5 border border-border text-sm font-medium hover:bg-muted transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
