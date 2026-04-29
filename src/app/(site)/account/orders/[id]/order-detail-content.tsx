"use client";

import { useOrderByIdQuery, useInitiatePaymentMutation, useDownloadInvoiceMutation } from "@/features/checkout/hooks/useOrders";
import { CheckCircle, Clock, FileDown, Package, MapPin, CreditCard, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { OrderStatus } from "@/features/checkout/types";
import ProtectedRoute from "@/components/shared/protected-route";
import { Button } from "@/components/ui/button";
import NotFoundMessage from "@/components/shared/not-found-message";
import Loading from "@/components/layout/loading";

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock className="size-5 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="size-5 text-green-600" />,
  PROCESSING: <Package className="size-5 text-blue-500" />,
  SHIPPED: <Truck className="size-5 text-indigo-500" />,
  DELIVERED: <CheckCircle className="size-5 text-green-700" />,
  CANCELLED: <XCircle className="size-5 text-destructive" />,
  FAILED: <XCircle className="size-5 text-destructive" />,
};

const STATUS_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

function OrderDetailInner({ id }: { id: string }) {
  const { data, isLoading, isError } = useOrderByIdQuery(id);
  const order = data?.data;

  const { mutate: initiatePayment, isPending: isInitiatingPayment } = useInitiatePaymentMutation();
  const { mutate: downloadInvoice, isPending: isDownloading } = useDownloadInvoiceMutation();

  if (isLoading) return <Loading />;

  if (isError || !order)
    return (
      <NotFoundMessage
        title="Order Not Found"
        description="We couldn't find this order. It may have been removed or the link is invalid."
        backLabel="Back to My Orders"
        backHref="/account/orders"
      />
    );

  const {
    orderNumber,
    orderStatus,
    billingDetails,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
    paymentId,
    coupon,
    createdAt,
  } = order;

  const isCancelled = orderStatus === "CANCELLED";
  const currentStep = isCancelled ? -1 : STATUS_STEPS.indexOf(orderStatus);
  const canPay = paymentId?.paymentMethod === "online" && paymentId?.status !== "PAID";

  return (
    <div className="container py-10 max-w-3xl">
      {/* ── Back link ────────────── */}
      <Link
        href="/account/orders"
        className="text-sm text-muted-foreground hover:text-foreground transition mb-6 inline-block"
      >
        ← Back to My Orders
      </Link>

      {/* ── Header ───────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on{" "}
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {STATUS_ICON[orderStatus]}
            <span className="text-sm font-semibold capitalize">{orderStatus.toLowerCase()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadInvoice(order)}
            disabled={isDownloading}
            className="gap-1.5"
          >
            <FileDown className="size-4" />
            {isDownloading ? "Generating..." : "Invoice"}
          </Button>
        </div>
      </div>

      {/* ── Progress tracker ─────── */}
      {!isCancelled && (
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center min-w-[480px]">
            {STATUS_STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              const active = idx === currentStep;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`size-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                        done
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground"
                      } ${active ? "ring-2 ring-primary/30 ring-offset-1" : ""}`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${done ? "font-medium" : "text-muted-foreground"}`}>
                      {step.charAt(0) + step.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${idx < currentStep ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 mb-6 text-sm font-medium">
          <XCircle className="size-4 shrink-0" />
          This order has been cancelled.
        </div>
      )}

      {/* ── Order Items ──────────── */}
      <div className="border border-border mb-5">
        <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border">
          <Package className="size-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Items Ordered</h2>
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

      {/* ── Billing & Payment ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Delivery Address</h3>
          </div>
          <p className="text-sm font-medium">
            {billingDetails.firstName} {billingDetails.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{billingDetails.streetAddress}</p>
          <p className="text-sm text-muted-foreground">
            {billingDetails.city}, {billingDetails.district}
            {billingDetails.postcode ? ` - ${billingDetails.postcode}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{billingDetails.phone}</p>
          <p className="text-sm text-muted-foreground">{billingDetails.email}</p>
        </div>

        <div className="border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Payment</h3>
          </div>
          <p className="text-sm font-medium">
            {paymentId?.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {paymentId?.paymentMethod === "cod"
              ? "Pay upon delivery."
              : paymentId?.status === "PAID"
                ? "Paid online."
                : paymentId?.status === "FAILED"
                  ? "Payment failed."
                  : "Pending"}
          </p>
          {canPay && (
            <Button
              onClick={() => initiatePayment(order._id)}
              disabled={isInitiatingPayment}
              size="sm"
              className="mt-3"
            >
              <CreditCard className="size-4 mr-2" />
              {isInitiatingPayment ? "Redirecting..." : "Pay Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailContent({ id }: { id: string }) {
  return (
    <ProtectedRoute>
      <OrderDetailInner id={id} />
    </ProtectedRoute>
  );
}
