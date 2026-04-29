"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IOrder, OrderStatus, PaymentStatus } from "@/features/checkout/types";
import { useAllOrdersQuery, useDownloadInvoiceMutation } from "@/features/checkout/hooks/useOrders";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import DashboardButton from "@/components/dashboard/dashboard-button";

// ── Badge helpers ─────────────────────────────────────────────────────────────

const ORDER_STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function InvoicesContent() {
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const { data } = useAllOrdersQuery(query);

  const { mutate: downloadSingle, isPending: isDownloading } = useDownloadInvoiceMutation();

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "Invoice #",
      cell: ({ row }) => <span className="font-mono font-semibold text-xs">INV_{row.original.orderNumber}</span>,
    },
    {
      accessorKey: "billingDetails",
      header: "Customer",
      cell: ({ row }) => {
        const { firstName, lastName, email } = row.original.billingDetails;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      accessorKey: "items",
      header: "Items",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => <span>{row.original.items.length}</span>,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => <span className="font-semibold">৳{row.original.total.toLocaleString()}</span>,
    },
    {
      accessorKey: "paymentId",
      header: "Payment",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => {
        const payment = row.original.paymentId;
        return payment ? (
          <Badge variant={PAYMENT_STATUS_VARIANTS[payment.status] ?? "outline"} className="capitalize text-xs">
            {payment.status.toLowerCase()}
          </Badge>
        ) : null;
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Order Status",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => (
        <Badge variant={ORDER_STATUS_VARIANTS[row.original.orderStatus]} className="capitalize text-xs">
          {row.original.orderStatus.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "_id",
      header: "Invoice",
      cell: ({ row }) => (
        <DashboardButton
          variant="ghost"
          size="sm"
          onClick={() => downloadSingle(row.original)}
          disabled={isDownloading}
          className="gap-1.5 text-xs h-7"
          id={`download-invoice-${row.original._id}`}
        >
          <FileDown className="size-3.5" />
          PDF
        </DashboardButton>
      ),
    },
  ];

  return <DataTable columns={columns} data={data?.data ?? []} meta={data?.meta} />;
}
