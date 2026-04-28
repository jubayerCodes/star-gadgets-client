"use client";

import { useState } from "react";
import { useMyOrdersQuery } from "@/features/checkout/hooks/useOrders";
import { IOrder } from "@/features/checkout/types";
import Link from "next/link";
import { Package } from "lucide-react";
import OrderCard from "./order-card";
import AccountLayout from "@/features/account/components/account-layout";

function MyOrdersContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrdersQuery(page);

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
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
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
    <AccountLayout title="My Account">
      <div>
        <h2 className="text-lg font-semibold mb-5">Order History</h2>
        <MyOrdersContent />
      </div>
    </AccountLayout>
  );
}
