"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, CreditCard, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCancelOrderMutation, useInitiatePaymentMutation } from "@/features/checkout/hooks/useOrders";
import { IOrder, OrderStatus, PaymentStatus } from "@/features/checkout/types";

const STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
  FAILED: "destructive",
};

const PAYMENT_STATUS_VARIANTS: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "secondary",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};

/** Statuses where the user can still cancel */
const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING"];

interface OrderCardProps {
  order: IOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrderMutation();
  const { mutate: initiatePayment, isPending: isInitiatingPayment } = useInitiatePaymentMutation();

  const isOnlinePaid = order.paymentId?.paymentMethod === "online" && order.paymentId?.status === "PAID";
  const canCancel = CANCELLABLE_STATUSES.includes(order.orderStatus) && !isOnlinePaid;
  const canPay = order.paymentId?.paymentMethod === "online" && order.paymentId?.status !== "PAID";

  const isPending = isCancelling || isInitiatingPayment;

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      {/* ── Header row ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{order.orderNumber}</span>
            <Badge variant={STATUS_VARIANTS[order.orderStatus]} className="text-xs capitalize">
              {order.orderStatus.charAt(0) + order.orderStatus.slice(1).toLowerCase()}
            </Badge>
            {order.paymentId && (
              <Badge variant={PAYMENT_STATUS_VARIANTS[order.paymentId.status]} className="text-xs capitalize">
                {order.paymentId.paymentMethod === "cod" ? "COD" : "Online"} · {order.paymentId.status.toLowerCase()}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isPending} className="px-2">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Order actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => router.push(`/account/orders/${order._id}`)}
                className="text-primary focus:bg-primary/10 focus:text-primary [&_svg]:text-primary cursor-pointer"
              >
                <Eye className="size-4 mr-2 text-muted-foreground" />
                View details
              </DropdownMenuItem>

              {canPay && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => initiatePayment(order._id)}
                    disabled={isInitiatingPayment}
                    className="text-primary focus:bg-primary/10 focus:text-primary [&_svg]:text-primary cursor-pointer"
                  >
                    <CreditCard className="size-4 mr-2" />
                    {isInitiatingPayment ? "Redirecting..." : "Pay Now"}
                  </DropdownMenuItem>
                </>
              )}

              {canCancel && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => cancelOrder(order._id)}
                    disabled={isCancelling}
                    className="cursor-pointer"
                  >
                    <XCircle className="size-4 mr-2" />
                    {isCancelling ? "Cancelling..." : "Cancel order"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
}
