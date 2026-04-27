"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, ClipboardList, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePaymentByTransactionIdQuery } from "@/features/checkout/hooks/useOrders";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  const { data: paymentData, isLoading } = usePaymentByTransactionIdQuery(transactionId);
  const orderId = paymentData?.data?.orderId;

  return (
    <div className="container max-w-2xl! mx-auto py-20">
      <div className="flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <div className="rounded-full bg-green-100 p-5">
          <CheckCircle className="size-14 text-green-600" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Your payment has been confirmed and your order is now being processed.
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
