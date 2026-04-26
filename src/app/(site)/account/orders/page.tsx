"use client";

import { useState } from "react";
import { useMyOrdersQuery } from "@/features/checkout/hooks/useOrders";
import { useCancelOrderMutation } from "@/features/checkout/hooks/useOrders";
import { IOrder, OrderStatus, PaymentStatus } from "@/features/checkout/types";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/shared/protected-route";
import { Button } from "@/components/ui/button";

const STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

const PAYMENT_STATUS_VARIANTS: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "secondary",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};

/** Statuses where the user can still cancel */
const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING"];

function MyOrdersContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrdersQuery(page);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrderMutation();

  const orders: IOrder[] = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="size-12 text-muted-foreground mb-4" />
        <p className="text-lg font-semibold">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-1">Start shopping to see your orders here.</p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col divide-y divide-border border border-border">
        {orders.map((order) => {
          const canCancel = CANCELLABLE_STATUSES.includes(order.orderStatus);

          return (
            <div key={order._id} className="flex flex-col gap-3 px-5 py-4">
              {/* ── Header row ─────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{order.orderNumber}</span>
                    <Badge variant={STATUS_VARIANTS[order.orderStatus]} className="text-xs capitalize">
                      {order.orderStatus.charAt(0) + order.orderStatus.slice(1).toLowerCase()}
                    </Badge>
                    {order.paymentId && (
                      <Badge
                        variant={PAYMENT_STATUS_VARIANTS[order.paymentId.status]}
                        className="text-xs capitalize"
                      >
                        {order.paymentId.paymentMethod === "cod" ? "COD" : "Online"} ·{" "}
                        {order.paymentId.status.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* ── Right: total + actions ──────────────────────── */}
                <div className="flex items-center gap-3 sm:shrink-0">
                  <span className="font-bold text-sm">৳{order.total.toLocaleString()}</span>
                  {canCancel && (
                    <Button
                      onClick={() => cancelOrder(order._id)}
                      disabled={isCancelling}
                      variant={"outline"}
                      size={"sm"}
                      className="gap-1 text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
                    >
                      Cancel
                    </Button>
                  )}
                  <Link
                    href={`/account/orders/${order._id}`}
                    className="text-xs font-medium text-primary border border-primary px-3 h-8 flex items-center hover:bg-primary hover:text-primary-foreground transition"
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* ── Items list ─────────────────────────────────────── */}
              <div className="flex flex-col gap-2 pl-0">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 justify-start">
                    <div className="relative size-10 shrink-0 border border-border bg-muted overflow-hidden">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-0.5" sizes="40px" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate leading-tight">{item.title}</span>
                      {item.attributes && item.attributes.length > 0 && (
                        <span className="text-[11px] text-muted-foreground">
                          {item.attributes.map((a) => `${a.name}: ${a.value}`).join(" · ")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.total > meta.limit && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-border hover:bg-muted disabled:opacity-40 transition"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={orders.length < meta.limit}
            className="px-4 py-2 text-sm border border-border hover:bg-muted disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute>
      <div className="container py-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <MyOrdersContent />
      </div>
    </ProtectedRoute>
  );
}
