"use client";

import { useSearchParams } from "next/navigation";
import { Ban, ClipboardList, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePaymentByTransactionIdQuery } from "@/features/checkout/hooks/useOrders";

export default function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const { data: paymentData, isLoading } = usePaymentByTransactionIdQuery(transactionId);
  const orderId = paymentData?.data?.orderId;

  return (
    <div className="container max-w-2xl! py-20">
      <div className="flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <div className="rounded-full bg-yellow-100 p-5">
          <Ban className="size-14 text-yellow-600" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-sm text-muted-foreground">
            You cancelled the payment. Your order is still saved — you can complete the payment
            anytime from your order details page.
          </p>
        </div>

        {/* Transaction ID */}
        {transactionId && (
          <div className="w-full border border-border bg-muted/30 px-5 py-3 text-left">
            <p className="text-xs text-muted-foreground mb-0.5">Transaction ID</p>
            <p className="text-sm font-mono font-semibold break-all">{transactionId}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {!isLoading && orderId && (
            <Link
              href={`/account/orders/${orderId}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <ExternalLink className="size-4" />
              View Order
            </Link>
          )}
          <Link
            href="/account/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-sm font-medium hover:bg-muted transition"
          >
            <ClipboardList className="size-4" />
            My Orders
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-sm font-medium hover:bg-muted transition"
          >
            <ShoppingBag className="size-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
